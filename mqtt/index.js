const Devices = require('../schemas/device')

// 2. BINARY PARSER
const CRC32 = require('crc-32')
const Parser = require('binary-parser').Parser
const Protocol = new Parser()
    .uint8('header')
    .uint8('length')
    .uint8('cmmd')
    .uint8('loraID')
    .floatle('current')
    .floatle('voltage')
    .floatle('frequency')
    .floatle('powerFactor')
    .floatle('apparentPower')
    .floatle('activePower')
    .floatle('reactivePower')
    .uint8('end')
    .int32le('checksum')

// 3. MQTT
const mqtt = require('mqtt')
const client = mqtt.connect(process.env.MQTT_BROKER)

client.on('connect', () => {
    console.log('[MQTT] Broker connected')

    client.subscribe(process.env.TOPIC_DEVICES, (err) => {
        if (err)
            console.error('\n\n[ERROR] Subscribing to topic /devices', err)
    })
})

client.on('message', (topic, message) => {
    // console.log(`[TOPIC]: ${topic}\t[MESSAGE]: ${message}`)

    switch (topic) {
        case process.env.TOPIC_DEVICES:
            client.subscribe(message.toString(), (err) => {
                if(err)
                    console.error(`\n\n[ERROR] Subscribing to device: ${message}`, err)
            })
            break

        default:
            console.log(`${topic} - ${message.length}`)
            // Payload starts at the 4 byte and ends at the (length - 5 byte: 4 checksum, 1 end of package)
            let checksum = CRC32.buf( message.subarray(4, message.length - 5) )
            let protocol = Protocol.parse(message)
            
            // Emit from socket.io
            let socketProtocol = {
                current: protocol.current,
                voltage: protocol.voltage,
                frequency: protocol.frequency,
                powerFactor: protocol.powerFactor,
                apparent: protocol.apparentPower,
                reactive: protocol.reactivePower,
                active: protocol.activePower
            }
            global._io.emit('/update', { mac: topic, protocol: socketProtocol } )

            let obj = {
                mac: topic.toString(),
                ok: (checksum === protocol.checksum),
                protocol,
                package: message
            }
            Devices.create(obj)
            break
    }
})

module.exports = client