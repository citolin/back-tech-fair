// 0. Dotenv
const dotenv = require('dotenv')
dotenv.config()

// 1. MONGOOSE
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', e => console.error.bind(console, 'connection error'))
db.on('open', ok => console.log('[MONGODB] Connected'))

// const app = require('express')
// const http = require('http').createServer(app)
// const io = require('socket.io')(http)
const io = require('socket.io')( process.env.PORT )

io.on('connection', (socket) => {
    console.log('[SOCKET.IO] Connected')
})

// Let them judge me
global._io = io

const mqtt = require('./mqtt')
