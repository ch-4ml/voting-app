const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const electorateRouter = express.Router();
const electorateModel = require('../model/electorate_model');

electorateRouter.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

// 새로운 선거권자 등록
electorateRouter.post('/registerElectorate', (req, res) => {
    const electorate = {
        vote_id: req.body.voteId,
        name: req.body.name,
        name_ex: req.body.name_ex,
        birthday: req.body.birthday,
        phone: req.body.phone,
        image: image,
        auth: null,
        vote_time: null
    };
    electorateModel.registerElectorate(electorate).then(result => {
        res.redirect('');
        
    }).catch(err => {
        res.redirect('', {err: err});
    });
});

// 선거권자 목록에 있는지 조회
electorateRouter.get('/checkElectorate/:voteId', (req, res) => {
    const electorate = {
        vote_id: req.param.voteId,
        name: req.body.name,
        name_ex: req.body.name_ex,
        birthday: req.body.birthday                                                                                                                                                                                                              
    };
    electorateModel.select(electorate).then(result => {
        req.session.electorate = {
            vote_id: result[0].vote_id,
            name: result[0].name,
            name_ex: result[0].name_ex
        };
        res.status(200).send({result: result[0]});
    }).catch(err => {
        res.status(500).send({err: err});
    });
});

// 인증 종류 별 인증번호 생성
electorateRouter.post('/registerAuth/:voteId/:category', (req, res) => {
    // 세션에서 id랑 auth결과 조회
    let auth = Math.floor(Math.random() * 10000);
    let len;
    if(req.param.category == 1) len = 6; // 휴대전화 인증
    else len = 4; // 현장 인증
    
    const data = {
        id: id,
        vote_id: req.param.voteId,
        auth: pad(auth, len)
    };

    electorateModel.createAuth(data).then(result => {
        // 휴대폰 SMS 전송
        res.status(200).send({result: result[0]});
    }).catch(err => {
        res.status(500).send({err: err});
    });
});

// 관리자가 투표자의 인증번호 조회
electorateRouter.get('/queryAuth/:voteId/', (req, res) => {
    
});

function pad(n, len) {
    n = n + '';
    return n.length >= len ? n : new Array(len - n.length + 1).join('0') + n;
}

module.exports = electorateRouter;