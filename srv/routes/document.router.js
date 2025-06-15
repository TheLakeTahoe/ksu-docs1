const Router = require('express')
const router = new Router()
const documentController = require('../controller/document.controller')

router.post('/get_docs_data', documentController.getDocumentsData)
router.get('/export_annotation', documentController.exportAnnotation)
router.get('/export_education_plan', documentController.exportEducationalPlan)
router.get('/export_education_and_thematic_plan', documentController.exportEducationalAndThematicPlan)
router.get('/export_ensuring_the_educational_proccess', documentController.exportEnsuringTheEducationalProccess)
router.get('/export_information_about_staffing', documentController.exportInformationAboutStaffing)
router.post('/send_document', documentController.sendDocument)
router.post('/send_documents_group', documentController.sendDocumentsGroup)
router.post('/go_to_edit_state', documentController.goToEditState)
router.post('/go_to_next_state', documentController.goToNextState)
router.post('/go_to_reject_state', documentController.goToRejectState)



module.exports = router

