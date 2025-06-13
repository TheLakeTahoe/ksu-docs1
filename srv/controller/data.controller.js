const { QueryTypes } = require('sequelize');
const db = require('../db.js');

class DataController {
    async getEducations(req, res) {
        try {
            const [rows] = await db.query('Select * From education'); // Деструктурируем первый элемент
            res.json(rows);
        } catch (error) {
            console.error('Ошибка при получении данных об образовании:', error);
            res.status(200).json({ message: 'Не удалось получить данные' });
        }
    }

    async getKSUDeparments(req, res) {
        try {
            const [rows] = await db.query('Select * From ksu_departments'); // Деструктурируем первый элемент
            res.json(rows);
        } catch (error) {
            console.error('Ошибка при получении данных о структурных подразделениях:', error);
            res.status(200).json({ message: 'Не удалось получить данные' });
        }
    }

    async getProgramTypes(req, res) {
        try {
            const [rows] = await db.query('Select * From program_types'); // Деструктурируем первый элемент
            res.json(rows);
        } catch (error) {
            console.error('Ошибка при получении данных о типах программ:', error);
            res.status(200).json({ message: 'Не удалось получить данные' });
        }
    }

    async getLessonShedules(req, res) {
        try {
            const [rows] = await db.query('Select * From lesson_shedules'); // Деструктурируем первый элемент
            res.json(rows);
        } catch (error) {
            console.error('Ошибка при получении данных о режимах занятий:', error);
            res.status(200).json({ message: 'Не удалось получить данные' });
        }
    }

    async getTypesGraduationDoc(req, res) {
        try {
            const [rows] = await db.query('Select * From type_grad_docs'); // Деструктурируем первый элемент
            res.json(rows);
        } catch (error) {
            console.error('Ошибка при получении данных о типах документов об окончании:', error);
            res.status(200).json({ message: 'Не удалось получить данные' });
        }
    }

    async getPrimaryFormData(req, res) {
        try {
            const { primary_form_id } = req.body

            const data = await db.query(`Select program_name, target_audience, program_hours, program_types.name as p_type_name, type_grad_docs.name as grad_doc_name, lesson_shedules.name as shedule_name From primary_forms
                                         Inner Join program_types On program_types.id=program_type_id
                                         Inner Join type_grad_docs On type_grad_docs.id=type_graduation_doc_id
										 Inner Join lesson_shedules On lesson_shedules.id=lesson_shedule_id
                                         Where primary_forms.id=$1::Integer`, {
                bind: [primary_form_id],
                type: QueryTypes.SELECT
            })
            return res.json({ data })

        } catch (error) {
            console.error('Ошибка при получении данных для первичной формы:', error);
            res.status(200).json({ message: 'Не удалось получить данные' });
        }
    }

    async getFormAspects(req, res) {
        try {
            const { primary_form_id } = req.body
            const aspects = await db.query(`Select aspects.name, aspects.type From primary_forms
                                            Inner Join form_aspects On primary_form_id=primary_forms.id
                                            Inner Join aspects On aspect_id=aspects.id
                                            Where primary_forms.id=$1::Integer`, {
                bind: [primary_form_id],
                type: QueryTypes.SELECT
            })
            return res.json({ aspects })
        } catch (error) {
            console.error('Ошибка при получении данных об аспектах:', error);
            res.status(200).json({ message: 'Не удалось получить данные' });
        }
    }

    async getFormModules(req, res) {
        try {
            const { primary_form_id } = req.body
            const modules = await db.query(`Select modules.name, modules.h_overall, modules.h_lk, modules.h_lb, modules.h_pr, modules.h_sr, modules.control_form From primary_forms
                                            Inner Join form_program_modules  On primary_form_id=primary_forms.id
                                            Inner Join program_modules As modules On program_module_id=modules.id
                                            Where primary_forms.id=$1::Integer`, {
                bind: [primary_form_id],
                type: QueryTypes.SELECT
            })
            return res.json({ modules })
        } catch (error) {
            console.error('Ошибка при получении данных о модулях:', error);
            res.status(200).json({ message: 'Не удалось получить данные' });
        }
    }
}

module.exports = new DataController();