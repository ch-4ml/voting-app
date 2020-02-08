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
        console.log(candidateResult)
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

// 선거권자 조회 
userRouter.post('/electorate', async (req, res) => {
    let data;
    const vote_id = req.body.vote_id;
    const name = req.body.name;
    // const auth = req.body.auth;
    try {
        const result = await electorateModel.select(vote_id, name);
        const electorate = result;
        if (electorate) {   
            data = { status: true, msg: '선거권자 조회 성공', session: req.session.electorate, data: electorate };
        } else { // 데이터 없음
            data = { status: false, msg: '목록에서 일치하는 선거권자 없음', session: req.session.electorate };
        }
        console.log(data);
        res.status(200).send(data);
    } catch (err) {
        data = { status: false, msg: `선거권자 인증 오류: ${err}` };
        res.status(500).send(data);
    }
});

// 선거권자 전체 조회 
userRouter.post('/electorate/all', async (req, res) => {
    let data;
    const vote_id = req.body.vote_id;
    try {
        const result = await electorateModel.selectAll(vote_id);
        const electorate = result;
        if (electorate) {   
            data = { status: true, msg: '선거권자 조회 성공', session: req.session.electorate, data: electorate };
        } else { // 데이터 없음
            data = { status: false, msg: '목록에서 일치하는 선거권자 없음', session: req.session.electorate };
        }
        console.log(data);
        res.status(200).send(data);
    } catch (err) {
        data = { status: false, msg: `선거권자 인증 오류: ${err}` };
        res.status(500).send(data);
    }
});

// 투표 용지 수령
userRouter.post('/check', async (req, res) => {
    let data;
    const electorate_id = req.body.electorate_id;
    try {
        await electorateModel.updateStatus(electorate_id);
        data = { status: true, msg: `투표용지 수령` };
        res.status(200).send(data);
    } catch(err) {
        data = { status: false, msg: `투표용지 수령 오류: ${err}` };
        res.status(500).send(data);
    }
});

// 투표한 사람 수
userRouter.post('/count', async (req, res) => {
    let data;
    const vote_id = req.body.vote_id;

    try {
        const result = await electorateModel.count(vote_id);
        data = { status: true, msg: `현재 투표용지 수령 확인된 선거권자 수 조회 성공`, data: result };        
        res.status(200).send(data);
    } catch(err) {
        data = { status: false, msg: `현재 투표용지 수령 확인된 선거권자 수 조회 오류: ${err}` };
        res.status(500).send(data);
    }
});

module.exports = userRouter;
