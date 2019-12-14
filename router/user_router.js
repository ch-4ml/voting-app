const express = require('express');
const userRouter = express.Router();
const voteModel = require('../model/vote_model');
const electorateModel = require('../model/electorate_model');
const candidateModel = require('../model/candidate_model');
const request = require('request-promise-native');
const moment = require('moment'); require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// 선거 목록 조회
userRouter.get('/list/:status', async (req, res) => {
    let data;
    try {
        const result = await voteModel.selectAll(req.params.status);
        data = { result: true, msg: '선거 목록 조회 성공', data: result };
        res.status(200).send(data);
    } catch (err) {
        data = { result: false, msg: `선거 목록 조회 실패: ${err}` };
        res.status(500).send(data);
    }
});

// 진행 중인 선거 선택했을 때
userRouter.post('/vote', async (req, res) => {
    let data;
    const voteId = req.body.vote_id;
    const type = req.body.type;
    try {
        const voteResult = await voteModel.select(voteId);
        const candidateResult = await candidateModel.select(voteId, type);
        data = {
            result: true,
            msg: '진행 중인 선거 조회 성공',
            voteData: voteResult,
            candidateData: candidateResult,
        }
        res.status(200).send(data);
    } catch (err) {
        data = { result: false, msg: `진행 중인 선거 조회 실패: ${err}` };
        res.status(500).send(data);
    }
});

// 완료된 선거 선택
userRouter.post('/finvote', async (req, res) => {
    let data;
    const voteId = req.body.vote_id;
    try {
        let voteResult = await voteModel.select(voteId);
        let candidateResult = await candidateModel.result(voteId);
        data = {
            result: true,
            msg: '완료된 선거 조회 성공',
            voteData: voteResult,
            candidateData: candidateResult,
        }
        res.status(200).send(data);
    } catch (err) {
        data = { result: false, msg: `완료된 선거 조회 실패: ${err}` };
        res.status(500).send(data);
    }
});

// 선거권자 인증
userRouter.post('/electorate', async (req, res) => {
    let data;
    const vote_id = req.body.vote_id;
    const name = req.body.name + req.body.name_ex;
    const auth = req.body.auth;
    try {
        const result = await electorateModel.select(vote_id, name);
        if (result) {
            if (result.auth !== parseInt(auth)) { // 인증번호가 일치하지 않는 경우
                // 인증번호 불일치
                console.log('인증번호 불일치');
                data = { status: false, msg: '인증번호 불일치.' };
            } else if (result.completed) { // 이미 투표한 경우
                console.log('이미 투표함');
                data = { status: false, msg: '이미 투표함.' };
            } else {
                console.log('인증 성공');
                req.session.electorate = { ...result, auth: '********' };
                console.log(req.session.electorate);
                data = { status: true, msg: '인증 성공.', session: req.session.electorate }
            }
        } else { // 데이터 없음
            data = { status: false, msg: '일치하는 데이터 없음.' }
        }
        res.status(200).send(data);
    } catch (err) {
        data = { status: false, msg: `선거권자 인증 오류: ${err}` }
        res.status(500).send(data);
    }
});

// 휴대폰 번호로 인증번호 조회
userRouter.post('/auth', async (req, res) => {
    let data;
    const vote_id = req.body.vote_id;
    const name = req.body.name + req.body.name_ex;
    const phone = req.body.phone;
    try {
        let result = await electorateModel.select(vote_id, name);
        let a_phone = new Array(); // 폰 번호 배열 
        a_phone.push(phone);
        console.log(result);
        if(result != null) {
            if (phone === result.phone) {
                let auth = await electorateModel.updateAuth(result._id);
                console.log(auth);
                // 생성된 인증번호를 휴대폰으로 전송
                let config = {
                    uri: `https://api-sens.ncloud.com/v1/sms/services/${process.env.SENS_SERVICEID}/messages`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'x-ncp-auth-key': process.env.SENS_AUTHKEY,
                        'x-ncp-service-secret': process.env.SENS_SERVICESECRET,
                    },
                    json: {
                        'type': 'SMS',
                        'from': process.env.SENS_SENDNUMBER,
                        'to': a_phone,
                        'content': `[높은 뜻 정의교회]${user.name}님. ${user.vote_id}번 선거 인증번호는 [${auth}] 입니다.`
                    }
                };
                let response = await request(config);
                console.log("메시지 전송: " + response.status);
                data = { status: true, msg: '인증번호 전송 성공', auth: auth };
                res.status(200).send(data);
            } else { // 해당 투표 선거권자에 포함되지 않았음
                data = { status: false, msg: '입력 값과 일치하는 정보 없음' }
                res.status(500).send(data);
            }
        } else {
                data = { status: false, msg: '입력 값과 일치하는 정보 없음' }
                res.status(500).send(data);
        }
    } catch (err) {
        console.log(err);
        data = { status: false, msg: `인증번호 조회 오류: ${err}` }
        res.status(500).send(data);
    }
});

// 투표
userRouter.put('/vote', async (req, res) => {
    let data;
    // 회원이 선택한 후보자 목록 받아와서 득표수 올려줌
    const voteId = req.body.vote_id;
    const type = req.body.type;
    const candidatesIdArray = req.body.candidates;
    try {
        let result = await voteModel.select(voteId);
        let end = result.end;
        if (moment(end).isSameOrBefore(moment(), 'second')) {
            console.log('시간오류');
            data = { result: false, msg: '투표 종료 시간 경과' };
            res.status(500).send(data);
        } else {
            console.log('투표 가능');
            await candidateModel.updateVotes(voteId, candidatesIdArray, type);
            data = { result: true, msg: '투표 성공' };
            res.status(200).send(data);
        }
    } catch (err) {
        data = { result: false, msg: '투표 실패' };
        res.status(500).send(data);
        console.log(err);
    }
});

module.exports = userRouter;
