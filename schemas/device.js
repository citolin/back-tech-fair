const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
    mac: {
        type: String,
        required: true
    },

    time: {
        type: Date,
        required: true,
        default: Date.now
    },

    ok: {
        type: Boolean,
        required: true
    },

    protocol: {
        header: { type: Number },
        length: { type: Number },
        cmmd: { type: Number },
        loraID: { type: Number },
        current: { type: Number },
        voltage: { type: Number },
        frequency: { type: Number },
        powerFactor: { type: Number },
        apparentPower: { type: Number },
        activePower: { type: Number },
        reactivePower: { type: Number },
        checksum: { type: Number },
        end: { type: Number }
    },

    package: {
        type: Array,
    },

})

const Devices = mongoose.model('device', DeviceSchema)

module.exports = Devices