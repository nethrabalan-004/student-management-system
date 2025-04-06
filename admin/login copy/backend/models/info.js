
const mongoose = require('mongoose');
const infoSchema = new mongoose.Schema({
    counMail: { type: String, required: true },
    pass: { type: String, required: true }
});

const infom = mongoose.model('InfoCoun', infoSchema);
module.exports = infom;