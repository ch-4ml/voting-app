require('../db-connection');
const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    phone   : { type: String, required: true, trim: true },
    name    : String,
    birth   : Date,
    detail  : String,
    votes   : { type: Number, default: 0 }
});

module.exports = mongoose.model('Candidate', candidateSchema);