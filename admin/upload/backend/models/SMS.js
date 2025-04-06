// models/Sms.js
const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
    regNo: { type: Number, required: true },
    date: { type: String, required: true },
    parentPhone: { type: String, required: true },
    status: { type: String, required: true }, // 'Absent' or other relevant status
    flag: { type: Number, default: 0 }, // 0: SMS not sent, 1: SMS sent
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Sms = mongoose.model('Sms', smsSchema);

module.exports = Sms;