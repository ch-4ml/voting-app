const voteModel = require('../model/vote_model');
const moment = require('./moment')

class Time {
    // 선거 상태 초기화
    async initVoteStatus() {
        try {
            // '생성됨' 상태인 선거 조회
            let result = await voteModel.selectAll(0);
            for(let i = 0; i < result.length; i++) {
                let res = result[i];
                if(this.isDatePassed(res.begin)) {
                    await voteModel.updateStatus(res._id);
                } else {
                    this.registerTimer(res._id, res.begin);
                }
            }

            // '선거 진행 중' 상태인 선거 조회
            result = await voteModel.selectAll(1);
            for(let i = 0; i < result.length; i++) {
                let res = result[i];
                if(this.isDatePassed(res.end)) {
                    await voteModel.updateStatus(res._id);
                } else {
                    this.registerTimer(res._id, res.end);
                }
            }            
        } catch(error) {
            console.log(error);
            return;
        } 
    }

    // 경과 여부 확인
    isDatePassed(referenceDate) {
        return moment(referenceDate).isBefore(moment()) ? true : false;
    }

    // 타이머 등록
    registerTimer(voteId, referenceDate) {
        setTimeout(async () => { // 완료시간 경과 안됐으면 타이머 작동
            await voteModel.updateStatus(voteId);
        }, moment(referenceDate).diff(moment()));
    }
}

module.exports = new Time();