const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')

router.post('/user', userController.createUser)
router.post('/user', userController.getUsers)
router.post('/get_one_user', userController.getOneUser)
router.post('/user/:id', userController.deleteUser)

module.exports = router

