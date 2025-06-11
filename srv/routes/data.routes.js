const Router = require('express')
const router = new Router()
const dataController = require('../controller/data.controller')

router.get('/get_education', dataController.getEducations)
router.get('/get_ksu_department', dataController.getKSUDeparments)
router.get('/get_program_type', dataController.getProgramTypes)
router.get('/get_lesson_shedule', dataController.getLessonShedules)
router.get('/get_type_graduation_doc', dataController.getTypesGraduationDoc)
router.post('/get_primary_form_data', dataController.getPrimaryFormData)
router.post('/get_form_aspects', dataController.getFormAspects)
router.post('/get_form_modules', dataController.getFormModules)

module.exports = router

