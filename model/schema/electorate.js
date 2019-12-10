require('../db-connection');
const mongoose = require('mongoose');

const electorateSchema = mongoose.Schema({
    id      : mongoose.Schema.Types.ObjectId,
    phone   : { type: String, required: true, trim: true },
    name    : { type: String, required: true, trim: true },
    birth   : Date,
    status  : Number, // 0: 안함 / 1: 장로까지 / 2: 안수집사까지 / 3: 다함
    auth    : Number

    // 몇 번째 선거에 포함되어있는 녀석인지
});

module.exports = mongoose.model('Electorate', electorateSchema);