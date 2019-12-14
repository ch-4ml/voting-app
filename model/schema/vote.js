require('../db-connection');
const mongoose = require('mongoose');
// const candidateSchema = require('./candidate');
// const electorateSchema = require('./electorate');

const voteSchema = mongoose.Schema({
    _id         : mongoose.Schema.Types.ObjectId,
    title       : String,
    context     : String,
    begin       : Date,
    end         : Date,
    limit       : Number, // 몇 명 까지 투표할 지
    candidates1 : [{ type: Schema.Types.ObjectId, ref: 'Candidate' }],  // 장로 후보자 목록
    candidates2 : [{ type: Schema.Types.ObjectId, ref: 'Candidate' }],  // 안수집사 후보자 목록
    candidates3 : [{ type: Schema.Types.ObjectId, ref: 'Candidate' }],  // 권사 후보자 목록
    votes1      : { type: Number, default: 0 }, // 장로 총 투표 수
    votes2      : { type: Number, default: 0 }, // 안수집사 총 투표 수
    votes3      : { type: Number, default: 0 }, // 권사 총 투표 수
    electorates : [{ type: Schema.Types.ObjectId, ref: 'Electorate' }], // 선거권자
    status      : { type: Number, default: 0 } // 0: 투표 전 / 1: 투표 중 / 2: 투표 종료
});

module.exports = mongoose.model('Vote', voteSchema);