const Router = require('express')
const router = new Router()
const userRouter = require('./user.routes')
const dataRouter = require('./data.routes')
const requestRouter = require('./request.routes')
const documentRouter = require('./document.router')

router.use('/user', userRouter)
router.use('/data', dataRouter)
router.use('/request', requestRouter)
router.use('/document', documentRouter)

module.exports = router