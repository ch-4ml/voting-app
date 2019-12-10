require('../db-connection');
const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    id      : mongoose.Schema.Types.ObjectId,
    phone   : { type: String, required: true, trim: true },
    name    : String,
    birth   : Date,
    detail  : String,
    votes   : Number
    // 후보자가 어느 선거에 포함되어 있는지
    // 후보자 종류가 뭔지
});

module.exports = mongoose.model('Candidate', candidateSchema);