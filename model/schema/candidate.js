require('../db-connection');
const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    _id     : mongoose.Schema.Types.ObjectId,
    phone   : { type: String, required: true, trim: true },
    name    : String,
    birth   : Date,
    detail  : String,
    votes   : Number
});

module.exports = mongoose.model('Candidate', candidateSchema);