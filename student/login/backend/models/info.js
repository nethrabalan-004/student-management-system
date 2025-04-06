
const mongoose = require('mongoose');
const infoSchema = new mongoose.Schema({
    regNo: { type: String, required: true },
    lang: { type: String, required: true }
});

const info = mongoose.model('Info', infoSchema);
module.exports = info;