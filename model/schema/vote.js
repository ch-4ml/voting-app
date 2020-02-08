require('../db-connection');
const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
    title       : String,
    context     : String,
    begin       : Date,
    end         : Date,
    limit       : Number, // 몇 명 까지 투표할 지
    candidates1 : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],  // 장로 후보자 목록
    candidates2 : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],  // 안수집사 후보자 목록
    candidates3 : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],  // 권사 후보자 목록
    votes1      : { type: Number, default: 0 }, // 장로 총 투표 수
    votes2      : { type: Number, default: 0 }, // 안수집사 총 투표 수
    votes3      : { type: Number, default: 0 }, // 권사 총 투표 수
    electorates : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Electorate' }], // 선거권자
    participants: { type: Number, default: 0 }, // 선거 참여자 수
    status      : { type: Number, default: 0 }  // 0: 투표 전 / 1: 투표 중 / 2: 투표 종료
});

module.exports = mongoose.model('Vote', voteSchema);