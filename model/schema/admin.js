require('../db-connection');
const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id     : mongoose.Schema.Types.ObjectId,
    phone   : { type: String, required: true, trim: true },
    pw      : { type: String, required: true, trim: true },
    name    : { type: String, required: true, trim: true },
    rank    : { type: Number, default: 1 } // 0: root / 1: 일반
});

module.exports = mongoose.model('Admin', adminSchema);