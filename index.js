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


// Serial
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort(process.env.SERIAL, { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

// 2<131.96;3.79;-81.99;500.12;60.00>
parser.on('data', line => {
    try{
        console.log(`> ${line}`)
        var data = line.slice(2, line.length-2)
        var array = data.split(';')
        console.log(array)

        var socketProtocol = {
            voltage: array[0],
            current: array[1],
            powerFactor: array[2],
            activePower: array[3],
            frequency: array[4]
        }

        console.log('Sending: ', socketProtocol)    
        io.emit('/update', { mac: 'Device: ' + line[0], protocol: socketProtocol } )
    }
    catch(e) { console.log(e) }
})

// Let them judge me
global._io = io

// const mqtt = require('./mqtt')
