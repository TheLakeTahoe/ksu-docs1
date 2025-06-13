const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')

router.post('/register', userController.createUser)
router.post('/check_field', userController.checkUserField)
router.post('/login', userController.userAuth)
router.post('/get_user_data', userController.getUserData)

module.exports = router

