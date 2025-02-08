const express = require('express')
require('dotenv').config()
const cors = require('cors')
const router = require('./routes/index')
const sequelize = require('./db')
const models = require('./models/models')
const fill = require('./models/autofill.models')

const PORT = process.env.SRV_PORT || 8080

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        app.listen(PORT, () => console.log(`Started at port: ${PORT}...`))
    }
    catch (e) {
        console.log(e)
    }
} 

start()
