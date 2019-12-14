const express = require('express');
const adminRouter = express.Router();
const voteModel = require('../model/vote_model');
const timeModule = require('../modules/time');
const candidateModel = require('../model/candidate_model');
const electorateModel = require('../model/electorate_model')
const adminModel = require('../model/admin_model');

// 새로운 선거 등록
adminRouter.post('/admin/vote', async (req, res) => {
    let data;
    const vote = {
        title: req.body.title,
        context: req.body.context,
        begin: req.body.begin_date,
        end: req.body.end_date,
        limit: req.body.limit
    };
    try {
        let result = await voteModel.create(vote);
        let index = result._id;
        timeModule.registerTimer(index, vote.begin);
        timeModule.registerTimer(index, vote.end);
        data = { result: true, msg: '선거 등록 성공', data: index };
        res.status(200).send(data);
    } catch (err) {
        data = { result: false, msg: '선거 등록 실패' };
        console.log(`선거 등록 오류: ${err}`);
        res.status(500).send(data);
    }
});

// 새로운 후보자 등록
adminRouter.post('/admin/candidate', async (req, res) => {
    let data;
    const _id = req.body.vote_id;
    const type = req.body.type;
    const candidatesList = JSON.parse(req.body.candidates);
    const candidates = new Array();
    for (var i = 1; i < candidatesList.length; i++) {
        const candidate = {
            name: candidatesList[i][0] + candidatesList[i][1],
            phone: candidatesList[i][2],
            detail: candidatesList[i][3]
        };
        candidates.push(candidate);
    }
    console.log(candidates);
    try {
        const candidatesIdObjArray = await candidateModel.create(_id, candidates);
        const result = await voteModel.updateCandidates(_id, type, candidatesIdObjArray);
        data = { result: true, msg: result };
        res.status(200).send(data);
    } catch (err) {
        data = { result: false, msg: '후보자 등록 실패' };
        res.status(500).send(data);
    }
});

// 새로운 선거권자 등록
adminRouter.post('/admin/electorate', async (req, res) => {
    let data;
    const _id = req.body.vote_id; 
    const electoratesList = JSON.parse(req.body.electorates);
    const electorates = new Array();
    for (var i = 1; i < electoratesList.length; i++) {
        const electorate = {
            name: electoratesList[i][0] + electoratesList[i][1],
            phone: electoratesList[i][2],
            birth: electoratesList[i][3]
        };
        electorates.push(electorate);
    }
    console.log(electorates);
    try {
        const electorateIdObjArray = await electorateModel.create(_id, electorates);
        const result = await voteModel.updateElectorates(_id, electorateIdObjArray);
        data = { result: true, msg: result };
        res.status(200).send(data);
    } catch (err) {
        data = { result: false, msg: '선거권자 등록 실패' };
        res.status(500).send(data);
    }
});

// 선거 삭제
adminRouter.delete('/delete', async (req, res) => {
    let data;
    let voteId = req.body.voteId;
    try {
        await candidateModel.delete(voteId);
        await electorateModel.delete(voteId);
        await voteModel.delete(voteId);
        data = { result: true, msg: '선거 삭제 성공' };
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        data = { result: false, msg: '선거 삭제 실패' };
        res.status(500).send(data);
    }
});

// 관리자가 직접 선거권자의 인증번호 생성 및 조회
adminRouter.post('/admin/auth', async (req, res) => {
    // 관리자로 로그인 되었는지 확인
    let data;
    const _id = req.body.vote_id;
    const name = req.body.name + req.body.name_ex;
    if (req.session.admin) {
        try {
            let e = await electorateModel.select(_id, name);
            let auth = await electorateModel.updateAuth(e._id);
            data = { result: true, msg: '인증번호 생성 성공', data: auth };
            res.status(200).send(data);
        } catch (err) {
            data = { result: false, msg: '인증번호 생성 실패' };
            res.status(500).send(data);
        }
    } else {
        data = { result: false, msg: '관리자 로그인 필요' };
        res.status(500).send(data);
    }
});

// 관리자 계정 생성
adminRouter.post('/admin', async (req, res) => {
    let data;
    let admin = {
        pw: req.body.password,
        name: req.body.name,
        phone: req.body.phone
    };
    try {
        await adminModel.create(admin);
        data = { result: true, msg: `${admin.name} 관리자 계정 생성 성공` };
        res.status(200).send(data);
    } catch (err) {
        data = { result: false, msg: '관리자 계정 생성 실패' };
        res.status(500).send(data);
    }
});

// 로그인
adminRouter.post('/login', async (req, res) => {
    let data;
    let admin = {
        phone: req.body.phone,
        pw: req.body.password
    };
    try {
        let result = await adminModel.select(admin);
        req.session.admin = {
            ...result,
            pw: `********`
        };
        data = { result: true, msg: '로그인 성공', data: req.session };
        res.status(200).send(data);
    } catch (err) {
        data = { result: false, msg: '로그인 실패' }
        res.status(500).send(data);
    }
});

// 로그아웃
adminRouter.get('/logout', async (req, res) => {
    let data;
    if (req.session.admin) {
        req.session.destroy(
            function (err) {
                if (err) {
                    data = { result: false, msg: `로그아웃 오류: ${err}` }
                    return;
                }
                console.log('세션 삭제 성공');
                data = { result: true, msg: '로그아웃 성공' }
            }
        );
    } else {
        data = { result: false, msg: '세션 정보 없음' }
    }
    res.status(200).send(data);
});

// 세션 확인
adminRouter.get('/session', async (req, res) => {
    if (req.session.admin) {
        res.send({ result: true, data: req.session.admin, msg: "관리자" });
    } else {
        res.send({ result: false, data: null, msg: "로그인 안됨" });
    }
});

module.exports = adminRouter;