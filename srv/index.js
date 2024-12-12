const express = require('express')
require('dotenv').config()
const db_init = require('./init')
const cors = require('cors')
const router = require('./routes/index')

db_init()

const PORT = process.env.SRV_PORT || 8080

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

app.listen(PORT, () => console.log(`Started at port: ${PORT}...`))