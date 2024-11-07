
require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')


const url = "mongodb://root:123456789@localhost:27017/DecryptDigitalHype?authSource=admin"


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(cors())

const pollsRouter = require('./routes/polls')
app.use('/polls', pollsRouter)

app.listen(3000, () => console.log('Server Started'))
