// models/Student.js
const mongoose = require('mongoose');

const counMailSchema = new mongoose.Schema({
    counMail: { type: String, required: true},
    Pass: { type: String, required: true}
})

const councler=mongoose.model('councler',counMailSchema);


module.exports = councler;
