const { QueryTypes } = require('sequelize')
const db = require('../db.js')

class RequestController {
    constructor() {
        this.sendRequest = this.sendRequest.bind(this)
        this.getUserRequests = this.getUserRequests.bind(this)
        this.getRequestDocuments = this.getRequestDocuments.bind(this)
    }
    async sendRequest(req, res) {
        const transaction = await db.transaction()
        try {
            const {
                ksu_department_id,
                type_graduation_doc_id,
                coordinator,
                program_type_id,
                lesson_shedule,
                account_id,
                study_period,
                program_name,
                program_description_short,
                program_description,
                target_audience,
                program_hours,
                education_cost,
                aspects,
                teachers,
                modules
            } = req.body

            // 1. Получаем ID справочных данных
            const [
                { id: ksuDepartment },
                { id: typeGradDoc },
                { id: programType },
                { id: lessonSheduleId }
            ] = await Promise.all([
                this._getOrCreateReferenceId('ksu_departments', ksu_department_id, 'name', transaction),
                this._getOrCreateReferenceId('type_grad_docs', type_graduation_doc_id, 'name', transaction),
                this._getOrCreateReferenceId('program_types', program_type_id, 'name', transaction),
                this._getOrCreateReferenceId('lesson_shedules', lesson_shedule, 'name', transaction)
            ])

            // 2. Обработка координатора
            const programCoordinator = await this._handleCoordinator(coordinator, account_id, transaction)

            // 3. Создание основной формы
            const primaryFormID = await this._createPrimaryForm({
                ksuDepartment, typeGradDoc, programCoordinator,
                programType, lessonSheduleId, account_id,
                study_period, program_name, program_description_short,
                program_description, target_audience, program_hours,
                education_cost
            }, transaction)

            // 4. Параллельная обработка аспектов, преподавателей и модулей
            await Promise.all([
                this._processAspects(aspects, primaryFormID, transaction),
                this._processTeachers(teachers, primaryFormID, transaction),
                this._processModules(modules, primaryFormID, transaction)
            ])

            // 5. Создание группы документов
            await this._createDocumentGroup(primaryFormID, transaction)

            await transaction.commit()
            return res.status(200).json({ message: 'Заявка успешно отправлена!' })
        } catch (error) {
            await transaction.rollback()
            console.error('Ошибка при отправке заявки:', error)
            return res.status(500).json({
                message: 'Ошибка при отправке заявки',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        }
    }

    // Вспомогательные методы:

    async _getOrCreateReferenceId(table, value, field, transaction) {
        const result = await db.query(
            `Select id From ${table} 
            Where Trim(${field}) = $1 
            Limit 1`, {
            bind: [value],
            type: QueryTypes.SELECT,
            transaction
        })

        if (result.length) return result[0]

        const insertResult = await db.query(
            `Insert Into ${table} (${field}) 
            Values ($1) Returning id`, {
            bind: [value],
            type: QueryTypes.INSERT,
            transaction
        })

        return { id: insertResult[0][0].id }
    }

    async _handleCoordinator(coordinator, account_id, transaction) {
        let coordinatorFullName
        if (coordinator?.f_name) {
            coordinatorFullName = `${coordinator.f_name} ${coordinator.m_name} ${coordinator.l_name}`
        } else {
            const user = await db.query(
                `Select full_name From accounts 
                Where id = $1 
                Limit 1`, {
                bind: [account_id],
                type: QueryTypes.SELECT,
                transaction
            })
            coordinatorFullName = user[0]?.full_name
        }

        const existingCoordinator = await db.query(
            `Select id From program_coordinators 
            Where Trim(full_name) = $1 
            Limit 1`, {
            bind: [coordinatorFullName],
            type: QueryTypes.SELECT,
            transaction
        })

        if (existingCoordinator.length) return existingCoordinator[0].id

        const newCoordinator = await db.query(
            `Insert Into program_coordinators (full_name, phone, e_mail, address) 
            Values ($1, $2, $3, $4) Returning id`, {
            bind: [
                coordinatorFullName,
                coordinator?.phone || '',
                coordinator?.email || '',
                coordinator?.address || ''
            ],
            type: QueryTypes.INSERT,
            transaction
        })

        return newCoordinator[0][0].id
    }

    async _createPrimaryForm(data, transaction) {
        const result = await db.query(
            `Insert Into primary_forms (
                ksu_department_id, type_graduation_doc_id, program_coordinator_id,
                program_type_id, lesson_shedule_id, account_id,
                study_period, program_name, program_description_short,
                program_description, target_audience, program_hours,
                education_cost, created
            ) Values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
            Returning id`, {
            bind: [
                data.ksuDepartment, data.typeGradDoc, data.programCoordinator,
                data.programType, data.lessonSheduleId, data.account_id,
                data.study_period, data.program_name, data.program_description_short,
                data.program_description, data.target_audience, data.program_hours,
                data.education_cost
            ],
            type: QueryTypes.INSERT,
            transaction
        })

        return result[0][0].id
    }

    async _processAspects(aspects, primaryFormID, transaction) {
        return Promise.all(aspects.map(async aspect => {
            // 1. Находим или создаем аспект
            const existingAspect = await db.query(
                `SELECT id FROM aspects 
             WHERE TRIM(name) = $1 AND TRIM(type) = $2 
             LIMIT 1`, {
                bind: [aspect.name, aspect.type],
                type: QueryTypes.SELECT,
                transaction
            })

            const aspectId = existingAspect.length
                ? existingAspect[0].id
                : (await db.query(
                    `Insert Into aspects (name, type) 
                    Values ($1, $2) Returning id`, {
                    bind: [aspect.name, aspect.type],
                    type: QueryTypes.INSERT,
                    transaction
                }))[0][0].id

            // 2. Проверяем, существует ли уже связь
            const existingRelation = await db.query(
                `Select 1 From form_aspects 
                Where primary_form_id = $1 And aspect_id = $2 
                Limit 1`, {
                bind: [primaryFormID, aspectId],
                type: QueryTypes.SELECT,
                transaction
            })

            // 3. Если связи нет - создаем
            if (!existingRelation.length) {
                await db.query(
                    `Insert Into form_aspects (primary_form_id, aspect_id) 
                    Values ($1, $2)`, {
                    bind: [primaryFormID, aspectId],
                    type: QueryTypes.INSERT,
                    transaction
                })
            } else {
                console.log(`Связь между формой ${primaryFormID} и аспектом ${aspectId} уже существует`)
            }
        }))
    }

    async _processTeachers(teachers, primaryFormID, transaction) {
        return Promise.all(teachers.map(async teacher => {
            const existingTeacher = await db.query(
                `Select id From teachers 
                Where Trim(full_name) = $1 
                Limit 1`, {
                bind: [teacher.full_name],
                type: QueryTypes.SELECT,
                transaction
            })

            let teacherId
            if (existingTeacher.length) {
                teacherId = existingTeacher[0].id
            } else {
                const [positionId, workplaceId] = await Promise.all([
                    this._getOrCreateReferenceId('positions', teacher.position, 'name', transaction),
                    this._getOrCreateReferenceId('workplaces', teacher.workplace, 'name', transaction)
                ])

                const newTeacher = await db.query(
                    `Insert Into teachers (full_name, exp_total, workplace_id, position_id) 
                    Values ($1, $2, $3, $4) Returning id`, {
                    bind: [
                        teacher.full_name,
                        teacher.exp_total,
                        workplaceId.id,
                        positionId.id
                    ],
                    type: QueryTypes.INSERT,
                    transaction
                })

                teacherId = newTeacher[0][0].id
            }

            // Проверяем существование связи перед вставкой
            const existingRelation = await db.query(
                `Select 1 From form_teachers 
                 Where primary_form_id = $1 AND teacher_id = $2 
                 Limit 1`, {
                bind: [primaryFormID, teacherId],
                type: QueryTypes.SELECT,
                transaction
            })

            if (!existingRelation.length) {
                await db.query(
                    `Insert Into form_teachers (primary_form_id, teacher_id) 
                     Values ($1, $2)`, {
                    bind: [primaryFormID, teacherId],
                    type: QueryTypes.INSERT,
                    transaction
                })
            }
        }))
    }

    async _processModules(modules, primaryFormID, transaction) {
        return Promise.all(modules.map(async module => {
            const existingModule = await db.query(
                `Select id From program_modules 
                Where Trim(name) = $1 And h_overall = $2 
                Limit 1`, {
                bind: [module.name, module.h_overall],
                type: QueryTypes.SELECT,
                transaction
            })

            const moduleId = existingModule.length
                ? existingModule[0].id
                : (await db.query(
                    `Insert Into program_modules (name, h_overall) 
                    Values ($1, $2) Returning id`, {
                    bind: [module.name, module.h_overall],
                    type: QueryTypes.INSERT,
                    transaction
                }))[0][0].id

            // Проверяем существование связи перед вставкой
            const existingRelation = await db.query(
                `Select 1 From form_program_modules 
                 Where primary_form_id = $1 And program_module_id = $2 
                 Limit 1`, {
                bind: [primaryFormID, moduleId],
                type: QueryTypes.SELECT,
                transaction
            })

            if (!existingRelation.length) {
                await db.query(
                    `Insert Into form_program_modules (primary_form_id, program_module_id) 
                     Values ($1, $2)`, {
                    bind: [primaryFormID, moduleId],
                    type: QueryTypes.INSERT,
                    transaction
                })
            }
        }))
    }

    async _createDocumentGroup(primaryFormID, transaction) {
        const existingGroup = await db.query(
            `Select id From document_groups 
            Where primary_form_id = $1 
            Limit 1`, {
            bind: [primaryFormID],
            type: QueryTypes.SELECT,
            transaction
        })

        if (!existingGroup.length) {
            await db.query(
                `Insert Into document_groups (group_status_id, primary_form_id) 
                Values (2, $1)`, {
                bind: [primaryFormID],
                type: QueryTypes.INSERT,
                transaction
            })
        }
    }

    async getUserRequests(req, res) {
        try {
            const { account_id } = req.body

            const getUserRoleID = await db.query(
                `Select role_id From accounts
                Where id = $1::Integer`, {
                bind: [account_id],
                type: QueryTypes.SELECT
            })

            if (!getUserRoleID.length) {
                return res.status(404).json({ message: "Пользователь не найден" })
            }

            const userRoleID = getUserRoleID[0].role_id
            let query
            let params = []

            switch (userRoleID) {
                case 2:
                    query = `Select pf.id, pf.program_name, pf.created As date, account_id as owner,
                            gs.name As status_name, pf.program_description_short As description 
                            From primary_forms pf
                            Inner Join document_groups dg On dg.primary_form_id = pf.id
                            Inner Join group_statuses gs On gs.id = dg.group_status_id 
                            Where pf.account_id = $1::Integer
                            Group By pf.id, gs.name`
                    params = [account_id]
                    break

                case 3:
                    query = `Select pf.id, pf.program_name, pf.created As date, account_id as owner,
                            gs.name As status_name, pf.program_description_short As description
                            From primary_forms pf
                            Inner Join document_groups dg On dg.primary_form_id = pf.id
                            Inner Join group_statuses gs On gs.id = dg.group_status_id
                            Left Join request_steps rs On rs.id = dg.step_id
                            Where rs.id = 1 Or account_id = $1::Integer
                            Group By pf.id, gs.name`
                    params = [account_id]
                    break

                case 4:
                    const getDepartment = await db.query(
                        `Select ksu_department_id From accounts
                        Where id = $1::Integer`, {
                        bind: [account_id],
                        type: QueryTypes.SELECT
                    })

                    if (!getDepartment.length || !getDepartment[0].ksu_department_id) {
                        return res.json({ userrequests: [] })
                    }

                    query = `Select pf.id, pf.program_name, pf.created As date, account_id as owner,
                            gs.name As status_name, pf.program_description_short As description 
                            From primary_forms pf
                            Inner Join document_groups dg On dg.primary_form_id = pf.id
                            Inner Join group_statuses gs On gs.id = dg.group_status_id
                            Left Join request_steps rs On rs.id = dg.step_id
                            Where (rs.id = 2 And pf.ksu_department_id = $1::Integer) Or account_id = $2::Integer
                            Group By pf.id, gs.name`
                    params = [getDepartment[0].ksu_department_id, account_id]
                    break

                case 5:
                    query = `Select pf.id, pf.program_name, pf.created As date, account_id as owner,
                            gs.name As status_name, pf.program_description_short As description 
                            From primary_forms pf
                            Inner Join document_groups dg On dg.primary_form_id = pf.id
                            Inner Join group_statuses gs On gs.id = dg.group_status_id
                            Left Join request_steps rs On rs.id = dg.step_id
                            Where rs.id = 3 Or account_id = $1::Integer
                            Group By pf.id, gs.name`
                    params = [account_id]
                    break

                default:
                    return res.json({ userrequests: [] })
            }

            const userRequests = await db.query(query, {
                bind: params,
                type: QueryTypes.SELECT
            })

            return res.json({ userrequests: userRequests })

        } catch (error) {
            console.error('Ошибка при получении заявок:', error)
            return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
        }
    }

    async getRequestDocuments(req, res) {
        try {
            const { primary_form_id } = req.body

            const requestDocuments = await db.query(
                `Select * From document_groups
                Where primary_form_id = $1::Integer`, {
                bind: [primary_form_id],
                type: QueryTypes.SELECT
            })
            return res.json({ requestdocuments: requestDocuments })

        } catch (error) {
            console.error('Ошибка при документов заявки: ', error)
        }
    }
}

module.exports = new RequestController()
