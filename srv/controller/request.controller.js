const { QueryTypes } = require('sequelize');
const db = require('../db.js');

class RequestController {
    async sendRequest(req, res) {
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
            } = req.body;
            console.log(req.body)

            // Получаем ID подразделения
            const getDepartmentID = await db.query(
                `Select id From ksu_departments Where Trim(name) = $1`,
                {
                    bind: [ksu_department_id],
                    type: QueryTypes.SELECT
                }
            );
            const ksuDepartment = getDepartmentID[0]?.id;

            // Получаем ID типа документа
            const getGradDocID = await db.query(
                `Select id From type_grad_docs Where Trim(name) = $1`,
                {
                    bind: [type_graduation_doc_id],
                    type: QueryTypes.SELECT
                }
            );
            const typeGradDoc = getGradDocID[0]?.id;

            // Получаем ID типа программы
            const getProgramTypeID = await db.query(
                `Select id From program_types Where Trim(name) = $1`,
                {
                    bind: [program_type_id],
                    type: QueryTypes.SELECT
                }
            );

            const programType = getProgramTypeID[0]?.id;

            console.log('program_name: ', program_type_id)
            console.log('program_id: ', programType)

            // Получаем ID режима занятий
            const getLessonSheduleID = await db.query(
                `Select id From lesson_shedules Where Trim(name) = $1`,
                {
                    bind: [lesson_shedule],
                    type: QueryTypes.SELECT
                }
            );
            const lessonSheduleId = getLessonSheduleID[0]?.id;

            // Получаем или создаем координатора
            let programCoordinator;
            const coordinatorFullName = coordinator?.f_name
                ? `${coordinator.f_name} ${coordinator.m_name} ${coordinator.l_name}`
                : null;

            if (coordinatorFullName) {
                const checkCoordinator = await db.query(
                    `Select id From program_coordinators Where Trim(full_name) = $1`,
                    {
                        bind: [coordinatorFullName],
                        type: QueryTypes.SELECT
                    }
                );

                if (checkCoordinator.length === 0) {
                    const insertCoordinator = await db.query(
                        `Insert Into program_coordinators (full_name, phone, e_mail, address)
                         Values (?, ?, ?, ?) Returning id`,
                        {
                            replacements: [
                                coordinatorFullName,
                                coordinator.phone || '',
                                coordinator.email || '',
                                coordinator.address || ''
                            ],
                        }
                    );
                    programCoordinator = insertCoordinator[0][0].id;
                } else {
                    programCoordinator = checkCoordinator[0].id;
                }
            } else {

                // Если координатор не указан — координатором становится пользователь (по account_id)
                const userInfo = await db.query(
                    `Select full_name, phone, email From accounts Where id = $1`,
                    {
                        bind: [account_id],
                        type: QueryTypes.SELECT
                    }
                );
                const user = userInfo[0];
                const checkCoordinator = await db.query(
                    `Select id From program_coordinators Where Trim(full_name) = $1`,
                    {
                        bind: [user.full_name],
                        type: QueryTypes.SELECT
                    }
                );
                if (checkCoordinator.length === 0) {
                    const insertCoordinator = await db.query(
                        `Insert Into program_coordinators (full_name, phone, e_mail)
                     Values (?, ?, ?) Returning id`,
                        {
                            replacements: [
                                user.full_name,
                                user.phone || '',
                                user.email || '',
                            ],
                        }
                    );
                    programCoordinator = insertCoordinator[0][0].id;
                } else {
                    programCoordinator = checkCoordinator[0].id
                }
            }

            // Вставляем основную форму

            console.log(program_hours)

            const insertForm = await db.query(
                `Insert Into primary_forms (
                    ksu_department_id, type_graduation_doc_id, program_coordinator_id,
                    program_type_id, lesson_shedule_id, account_id,
                    study_period, program_name, program_description_short,
                    program_description, target_audience, program_hours,
                    education_cost, created
                )
                Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                Returning id`,
                {
                    replacements: [
                        ksuDepartment, typeGradDoc, programCoordinator,
                        programType, lessonSheduleId, account_id,
                        study_period, program_name, program_description_short,
                        program_description, target_audience, program_hours,
                        education_cost
                    ],
                }
            );
            const primaryFormID = insertForm[0][0].id;

            // Сохраняем аспекты
            for (let aspect of aspects) {
                const checkAspect = await db.query(
                    `Select id From aspects Where Trim(name) = $1 And Trim(type) = $2`,
                    {
                        bind: [aspect.name, aspect.type],
                        type: QueryTypes.SELECT
                    }
                );
                let aspectID;
                if (checkAspect.length === 0) {
                    const insertAspect = await db.query(
                        `Insert Into aspects (name, type) Values (?, ?) Returning id`,
                        {
                            replacements: [aspect.name, aspect.type],
                        }
                    );
                    aspectID = insertAspect[0][0].id;
                } else {
                    aspectID = checkAspect[0].id;
                }

                await db.query(
                    `Insert Into form_aspects (primary_form_id, aspect_id) Values (?, ?)`,
                    {
                        replacements: [primaryFormID, aspectID],
                    }
                );
            }

            // Сохраняем преподавателей
            for (let teacher of teachers) {
                const checkTeacher = await db.query(
                    `Select id From teachers Where Trim(full_name) = $1`,
                    {
                        bind: [teacher.full_name],
                        type: QueryTypes.SELECT
                    }
                );
                let teacherID;
                if (checkTeacher.length === 0) {
                    let teacherPositionID
                    const checkPosition = await db.query(
                        `Select id from positions
                        Where name = $1`,
                        {
                            bind: [teacher.position],
                            type: QueryTypes.SELECT
                        }
                    )
                    if (checkPosition.length === 0) {
                        const insertPosition = await db.query(
                            `Insert Into positions (name) 
                            Values (?) Returning id`,
                            {
                                replacements: [teacher.position]
                            }
                        )
                        teacherPositionID = insertPosition[0][0].id
                    } else {
                        teacherPositionID = checkPosition[0].id
                    }

                    let teacherWorkplaceID
                    const checkWorkplace = await db.query(
                        `Select id from workplaces
                        Where name = $1`,
                        {
                            bind: [teacher.workplace],
                            type: QueryTypes.SELECT
                        }
                    )
                    if (checkWorkplace.length === 0) {
                        const insertWorkplace = await db.query(
                            `Insert Into workplaces (name) 
                            Values (?) Returning id`,
                            {
                                replacements: [teacher.workplace]
                            }
                        )
                        teacherWorkplaceID = insertWorkplace[0][0].id
                    } else {
                        teacherWorkplaceID = checkWorkplace[0].id
                    }

                    const insertTeacher = await db.query(
                        `Insert Into teachers (full_name, exp_total, workplace_id, position_id)
                         Values (?, ?, ?, ?) Returning id`,
                        {
                            replacements: [
                                teacher.full_name,
                                teacher.exp_total,
                                teacherWorkplaceID,
                                teacherPositionID,
                            ],
                        }
                    );
                    teacherID = insertTeacher[0][0].id;
                } else {
                    teacherID = checkTeacher[0].id;
                }

                if (!primaryFormID || !teacherID) {
                    throw new Error('Один из параметров пуст: primaryFormID или teacherID')
                }

                await db.query(
                    `Insert Into form_teachers (primary_form_id, teacher_id) Values (?, ?)`,
                    {
                        replacements: [primaryFormID, teacherID]
                    }
                );
            }

            // Сохраняем модули
            for (let module of modules) {
                const checkModule = await db.query(
                    `Select id From program_modules 
                    Where Trim(name) = $1 And h_overall = $2::Integer`,
                    {
                        bind: [module.name, module.h_overall],
                        type: QueryTypes.SELECT
                    }
                );
                let moduleID;
                if (checkModule.length === 0) {
                    const insertModule = await db.query(
                        `Insert Into program_modules (name, h_overall)
                         Values (?, ?::Integer) Returning id`,
                        {
                            replacements: [module.name, module.h_overall],
                        }
                    );
                    moduleID = insertModule[0][0].id;
                } else {
                    moduleID = checkModule[0].id;
                }

                await db.query(
                    `Insert Into form_program_modules (primary_form_id, program_module_id) Values (?, ?)`,
                    {
                        replacements: [primaryFormID, moduleID],
                    }
                );

                // Подготавливаем группу для документов заявки
                const checkGroup = await db.query(
                    `Select * From document_groups 
                    Where primary_form_id = $1::Integer`,
                    {
                        bind: [primaryFormID],
                        type: QueryTypes.SELECT
                    }
                )
                if (checkGroup.length === 0)
                    await db.query(
                        `Insert Into document_groups (group_status_id, primary_form_id) Values (?, ?)`,
                        {
                            replacements: [2, primaryFormID],
                        }
                    )
            }

            return res.status(200).json({ message: 'Заявка успешно отправлена!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ошибка при отправке заявки' });
        }
    }
    async getUserRequests(req, res) {
        try {
            const { account_id } = req.body
            console.log(account_id)

            let userRoleID
            const getUserRoleID = await db.query(
                `Select role_id From accounts
                Where id = $1::Integer`, {
                bind: [account_id],
                type: QueryTypes.SELECT
            })

            if (getUserRoleID !== 0)
                userRoleID = getUserRoleID[0].role_id


            console.log("USER_ID: ", account_id)
            console.log("USER_ROLE_ID: ", userRoleID)

            if (userRoleID === 3) {
                const userRequests = await db.query(
                    `Select primary_forms.id, primary_forms.program_name as program_name, primary_forms.created as date, group_statuses.name as status_name From primary_forms
                    Inner Join document_groups On document_groups.primary_form_id = primary_forms.id
                    Inner Join group_statuses On group_statuses.id = document_groups.group_status_id
                    Inner Join request_steps On request_steps.id = document_groups.step_id
                    Where request_steps.id = 1
                    Group by primary_forms.id, group_statuses.name`, {
                    type: QueryTypes.SELECT
                })

                return res.json({ userrequests: userRequests })
            }


            const userRequests = await db.query(
                `Select primary_forms.id, primary_forms.program_name as program_name, primary_forms.created as date, group_statuses.name as status_name From primary_forms
                Inner Join document_groups On document_groups.primary_form_id = primary_forms.id
                Inner Join group_statuses On group_statuses.id = document_groups.group_status_id 
                Where account_id = $1::Integer
                Group by primary_forms.id, group_statuses.name`, {
                bind: [account_id],
                type: QueryTypes.SELECT
            })

            return res.json({ userrequests: userRequests })
        } catch (error) {
            console.log(error)
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
            console.log(error)
        }
    }
}

module.exports = new RequestController();
