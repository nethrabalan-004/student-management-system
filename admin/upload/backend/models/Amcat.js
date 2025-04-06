// models/Amcat.js
const mongoose = require('mongoose');

const amcatSchema = new mongoose.Schema({
    serialNo: Number,
    candidatePublicID: String,
    regNo: { type: Number, required: true },  // Ensure it's stored as an integer
    candidateName: { type: String, required: true },
    automata: Number,
    automataFixScore: Number,
    computerProgrammingScore: Number,
    computerProgrammingPercent: Number,
    writeXScore: Number,
    writeXPercent: Number,
    logicalAbilityScore: Number,
    logicalAbilityPercent: Number,
    englishScore: Number,
    englishPercent: Number,
    quantitativeScore: Number,
    quantitativePercent: Number,
    grouping: String,
    computerScienceScore: Number,
    computerSciencePercentile: Number,
    average: Number
});

//module.exports = mongoose.model('Amcat', amcatSchema);
module.exports = mongoose.models.Amcat || mongoose.model('Amcat', amcatSchema);