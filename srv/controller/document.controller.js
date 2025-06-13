const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { QueryTypes } = require('sequelize');
const db = require('../db.js')

class DocumentController {
    async getDocumentsData(req, res) {
        try {
            const { requestID } = req.body
            const doc_data = await db.query(`Select doc.data as data, doc.updated as updated
                                              From document_groups
                                              Left Join documents as doc On doc.id = documents_id
                                              Where primary_form_id=$1`, {
                bind: [requestID],
                type: QueryTypes.SELECT
            })

            return res.json(doc_data)

        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            res.status(500).send('Ошибка при получении данных');
        }
    }

    // EXPORT BLOCK (DONE!)
    async exportAnnotation(req, res) {
        try {
            const { annotationData, commonData } = req.query.formValues
            const templatePath = './templates/AnnotationDOP.docx';
            const content = fs.readFileSync(templatePath, 'binary');
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip);

            const learningOutcomes = commonData.aspects.reduce((acc, { name, type }) => {
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(name);
                return acc;
            }, {});

            const numberedModules = commonData.modules.map((module, index) => ({
                number: (index + 1).toString(),
                name: module.name,
                hours: module.h_overall
            }));



            const technologiesName = annotationData.technologies ? annotationData.technologies.map(item => item.name) : [];

            const data = {
                //* ОБЩИЕ ДАННЫЕ *//
                // Данные о программе
                programType: commonData.program.program_type,
                programName: commonData.program.program_name,
                standardCompliance: commonData.program.standart_compliance,
                programGoal: commonData.program.program_goal,
                category: commonData.program.listeners_category,
                // Данные о занятиях
                lessonDuration: commonData.lesson.duration,
                lessonCount: commonData.lesson.count,
                // Данные о часах
                hours: commonData.hours.academic,
                timeResource: commonData.hours.overall,

                //* АННОТАЦИЯ *//
                // Данные о программе
                direction: annotationData.program.direction,
                benefits: annotationData.program.benefits,
                controlForm: annotationData.program.control_form ? annotationData.program.control_form : 'Отсутствует',
                graduationDoc: annotationData.program.graduation_doc,

                // Данные о КГУ
                department: annotationData.ksu.department,
                auditory: annotationData.ksu.auditory,
                equipment: annotationData.ksu.equipment,

                // Прочее
                learningOutcomes: learningOutcomes,
                modules: numberedModules,
                technologies: technologiesName,
            };

            // Передача данных через render
            doc.render(data);
            const buf = doc.getZip().generate({ type: 'nodebuffer' });

            res.setHeader('Content-Disposition', 'attachment; filename=filled_template.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(buf);
        } catch (error) {
            console.error('Ошибка при генерации документа:', error);
            res.status(500).send('Ошибка при генерации документа');
        }
    }

    async exportEducationalPlan(req, res) {
        try {
            const { commonData } = req.query.formValues
            const templatePath = './templates/EducationalPlan.docx';
            const content = fs.readFileSync(templatePath, 'binary');
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip);

            const numberedModules = commonData.modules.map((module, index) => ({
                number: (index + 1).toString(),
                name: module.name || 'Без названия',
                h_overall: module.h_overall || '0',
                h_lk: module.h_lk || '0',
                h_lb: module.h_lb || '0',
                h_pr: module.h_pr || '0',
                h_sr: module.h_sr || '0',
                control_form: module.control_form || 'Отсутствует',

            }));

            const totals = commonData.modules.reduce(
                (acc, module) => {
                    acc.sum_h_overall += Number(module.h_overall || 0);
                    acc.sum_h_lk += Number(module.h_lk || 0);
                    acc.sum_h_lb += Number(module.h_lb || 0);
                    acc.sum_h_pr += Number(module.h_pr || 0);
                    acc.sum_h_sr += Number(module.h_sr || 0);
                    return acc;
                },
                {
                    sum_h_overall: 0,
                    sum_h_lk: 0,
                    sum_h_lb: 0,
                    sum_h_pr: 0,
                    sum_h_sr: 0
                }
            );

            const data = {
                programType: commonData.program.program_type || '',
                programName: commonData.program.program_name || '',
                programGoal: commonData.program.program_goal || '',
                category: commonData.program.listeners_category || '',
                educationForm: commonData.program.education_form || '',
                standartCompliance: commonData.program.standart_compliance || '',

                hours: commonData.hours.academic || '',

                lessonDuration: commonData.lesson.duration || '',
                lessonCount: commonData.lesson.count || '',

                modules: numberedModules,

                ...totals
            };

            // Передача данных через render
            doc.render(data);
            const buf = doc.getZip().generate({ type: 'nodebuffer' });

            res.setHeader('Content-Disposition', 'attachment; filename=filled_template.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(buf);
        } catch (error) {
            console.error('Ошибка при генерации документа:', error);
            res.status(500).send('Ошибка при генерации документа');
        }
    }

    async exportEducationalAndThematicPlan(req, res) {
        try {
            const { commonData } = req.query.formValues
            const templatePath = './templates/EducationalAndThematicPlan.docx';
            const content = fs.readFileSync(templatePath, 'binary');
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip);

            const numberedModules = commonData.modules.map((module, moduleIndex) => ({
                number: (moduleIndex + 1).toString(),
                name: module.name || 'Без названия',
                h_overall: module.h_overall || '0',
                h_lk: module.h_lk || '0',
                h_lb: module.h_lb || '0',
                h_pr: module.h_pr || '0',
                h_sr: module.h_sr || '0',
                control_form: module.control_form || 'Отсутствует',
                submodules: (module.submodules || []).map((sub, subIndex) => ({
                    sub_number: (moduleIndex + 1).toString() + "." + (subIndex + 1).toString(),
                    sub_name: sub['[name]'] || 'Без названия',
                    sub_h_overall: sub['[h_overall]'] || '0',
                    sub_h_lk: sub['[h_lk]'] || '0',
                    sub_h_lb: sub['[h_lb]'] || '0',
                    sub_h_pr: sub['[h_pr]'] || '0',
                    sub_h_sr: sub['[h_sr]'] || '0',
                    sub_control_form: sub['[control_form]'] || 'Отсутствует',
                }))
            }));

            const learningOutcomes = commonData.aspects.reduce((acc, { name, type }) => {
                const map = {
                    'know': 'З',
                    'can': 'У',
                    'own': 'В'
                }

                const prefix = map[type] || type?.[0] || '?'

                if (!acc[type]) {
                    acc[type] = []
                }

                acc[type].push({ label: `${prefix}.${acc[type].length + 1}`, name })
                return acc
            }, {})


            const data = {
                programType: commonData.program.program_type || '',
                programGoal: commonData.program.program_goal || '',
                educationForm: commonData.program.education_form || '',
                standartCompliance: commonData.program.standart_compliance || '',

                hours: commonData.hours.academic || '',

                lessonDuration: commonData.lesson.duration || '',
                lessonCount: commonData.lesson.count || '',

                learningOutcomes: learningOutcomes,

                modules: numberedModules,
            };

            // Передача данных через render
            doc.render(data);
            const buf = doc.getZip().generate({ type: 'nodebuffer' });

            res.setHeader('Content-Disposition', 'attachment; filename=filled_template.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(buf);
        } catch (error) {
            console.error('Ошибка при генерации документа:', error);
            res.status(500).send('Ошибка при генерации документа');
        }
    }

    async exportEnsuringTheEducationalProccess(req, res) {
        try {
            const { commonData } = req.query.formValues
            const templatePath = './templates/EnsuringTheEducationalProccess.docx';
            const content = fs.readFileSync(templatePath, 'binary');
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip);

            const numberedModules = commonData.modules.map((module, moduleIndex) => ({
                number: (moduleIndex + 1).toString(),
                name: module.name || '',
                ksu_data: module.ksu_data,
            }));

            const data = {
                programType: commonData.program.program_type || '',

                hours: commonData.hours.academic || '',

                modules: numberedModules,
            };

            // Передача данных через render
            doc.render(data);
            const buf = doc.getZip().generate({ type: 'nodebuffer' });

            res.setHeader('Content-Disposition', 'attachment; filename=filled_template.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(buf);
        } catch (error) {
            console.error('Ошибка при генерации документа:', error);
            res.status(500).send('Ошибка при генерации документа');
        }
    }

    async exportInformationAboutStaffing(req, res) {
        try {
            const { commonData } = req.query.formValues
            const templatePath = './templates/InformationAboutStaffing.docx';
            const content = fs.readFileSync(templatePath, 'binary');
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip);

            const numberedModules = commonData.modules.map((module, moduleIndex) => ({
                number: (moduleIndex + 1).toString(),
                name: module.name || '',
                teacher: module.teacher,
            }));

            const data = {
                programType: commonData.program.program_type || '',

                hours: commonData.hours.academic || '',

                modules: numberedModules,
            };

            // Передача данных через render
            doc.render(data);
            const buf = doc.getZip().generate({ type: 'nodebuffer' });

            res.setHeader('Content-Disposition', 'attachment; filename=filled_template.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.send(buf);
        } catch (error) {
            console.error('Ошибка при генерации документа:', error);
            res.status(500).send('Ошибка при генерации документа');
        }
    }


    // SEND BLOCK
    async sendDocument(req, res) {
        try {
            const { dataToSend, requestID } = req.body
            if (!dataToSend?.controlForm) dataToSend.controlForm = 'Отсутствует'
            let documentID
            const checkDocument = await db.query(`Select primary_form_id, documents_id From document_groups
                                                  Where primary_form_id=$1
                                                  Group by primary_form_id, documents_id`, {
                bind: [requestID],
                type: QueryTypes.SELECT
            })
            console.log(checkDocument)
            if (checkDocument.length === 1) {
                const newDocument = await db.query(`Insert Into documents(data, created, updated)
                                                    Values($1, Now(), Now())
                                                    Returning id`, {
                    bind: [dataToSend],
                    type: QueryTypes.INSERT
                })

                documentID = newDocument[0][0].id;

                const response = await db.query(`Update document_groups
                                                 Set documents_id=$1
                                                 Where primary_form_id=$2`, {
                    bind: [documentID, requestID],
                    type: QueryTypes.UPDATE
                })

                return res.json({ response })
            }
            else {
                documentID = checkDocument[0].documents_id
                const response = await db.query(`Update documents
                                                 Set data=$1, updated=Now()
                                                 Where id=$2`, {
                    bind: [dataToSend, documentID],
                    type: QueryTypes.UPDATE
                })

                return res.json({ response })
            }


        } catch (error) {
            console.error('Ошибка при отправке документа:', error);
            res.status(500).send('Ошибка при отправке документа');
        }
    }

    async sendDocumentsGroup(req, res) {
        try {
            const { requestID } = req.body
            console.log('REQUEST ID: ', requestID)

            const response = await db.query(`Update document_groups
                                            Set group_status_id=3, step_id=1
                                            Where primary_form_id=$1::Integer`, {
                bind: [requestID],
                type: QueryTypes.UPDATE
            })

            return res.json({ response, success: true })



        } catch (error) {
            console.error('Ошибка при отправке документа:', error);
            res.status(500).send('Ошибка при отправке документа');
        }
    }


    async goToEditState(req, res) {
        try {
            const { requestID } = req.body
            console.log('REQUEST ID: ', requestID)

            const response = await db.query(`Update document_groups
                                            Set group_status_id=4, step_id=$2
                                            Where primary_form_id=$1::Integer`, {
                bind: [requestID, null],
                type: QueryTypes.UPDATE
            })

            return res.json({ response, success: true })



        } catch (error) {
            console.error('Ошибка при отправке документа:', error);
            res.status(500).send('Ошибка при отправке документа');
        }
    }
}

module.exports = new DocumentController();
