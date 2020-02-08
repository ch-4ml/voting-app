require('../db-connection');
const mongoose = require('mongoose');

const electorateSchema = mongoose.Schema({
    phone    : { type: String, trim: true },
    name     : { type: String, required: true, trim: true },
    birth    : Date,
    status   : { type: Number, default: 0 }, // 0: 안함 / 1: 장로까지 / 2: 안수집사까지 / 3: 다함
    auth     : Number,
    completed: Date
});

module.exports = mongoose.model('Electorate', electorateSchema);