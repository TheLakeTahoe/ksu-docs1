const Router = require('express')
const router = new Router()
const documentController = require('../controller/document.controller')

router.post('/get_docs_data', documentController.getDocumentsData)
router.get('/export_annotation', documentController.exportAnnotation)
router.get('/export_education_plan', documentController.exportEducationalPlan)
router.get('/export_education_and_thematic_plan', documentController.exportEducationalAndThematicPlan)
router.get('/export_ensuring_the_educational_proccess', documentController.exportEnsuringTheEducationalProccess)
router.get('/export_information_about_staffing', documentController.exportInformationAboutStaffing)
router.post('/send_annotation', documentController.sendAnnotation)
router.post('/send_educational_plan', documentController.sendEducationalPlan)
router.post('/send_educational_and_thematic_plan', documentController.sendEducationalAndThematicPlan)
router.post('/send_ensuring_the_educational_proccess', documentController.sendEnsuringTheEducationalProccess)
router.post('/send_information_about_staffing', documentController.sendInformationAboutStaffing)
router.post('/send_document_group', documentController.sendDocumentsGroup)
router.post('/go_to_edit_state', documentController.goToEditState)



module.exports = router

