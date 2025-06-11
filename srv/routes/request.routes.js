const Router = require('express')
const router = new Router()
const requestRouter = require('../controller/request.controller')

router.post('/send_request', requestRouter.sendRequest)
router.post('/get_user_requests', requestRouter.getUserRequests)
router.post('/get_request_documents', requestRouter.getRequestDocuments)

module.exports = router

