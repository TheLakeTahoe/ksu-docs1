const Router = require('express')
const router = new Router()
const userRouter = require('./user.routes')

router.use('/user', userRouter)
// router.use('/message')
// router.use('/n_a1')
// router.use('/n_a2')
// router.use('/n_a3')

module.exports = router