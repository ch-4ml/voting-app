const Vote = require('./schema/vote');

class VoteModel {
    // 새 선거 생성
    create(vote) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.create(vote);
                resolve(result);
            } catch(err) {
                console.log(`선거 생성 오류: ${err}`);
                reject("선거 생성 실패");
            }
        });
    }

    // 후보자 등록
    updateCandidates(_id, type, candidatesIdObjArray) {
        return new Promise(async (resolve, reject) => {
            let text = "";
            try {
                switch(type) {
                    case 1:
                        await Vote.updateOne({ _id }, { $set: { candidates1: candidatesIdObjArray } });
                        text = "장로 등록 성공";
                        break;
                    case 2:
                        await Vote.updateOne({ _id }, { $set: { candidates2: candidatesIdObjArray } });
                        text = "안수집사 등록 성공";
                        break;
                    case 3:
                        await Vote.updateOne({ _id }, { $set: { candidates3: candidatesIdObjArray } });
                        text = "권사 등록 성공";
                        break;
                    default:
                        text = "잘못된 값"
                        break;
                }
                console.log(text);
                resolve(text);
            } catch(err) {
                console.log(`후보자 등록 오류: ${err}`);
                reject(`후보자 등록 실패`);
            }
        });
    }

    // 선거권자 등록
    updateElectorates(_id, electorateIdObjArray) {
        return new Promise(async (resolve, reject) => {
            try {
                await Vote.updateOne({ _id }, { $set: { electorates: electorateIdObjArray } });
                resolve("선거권자 등록 성공");
            } catch(err) {
                console.log(`선거권자 등록 오류: ${err}`);
                reject("선거권자 등록 실패");
            }
        });
    }

    // 선거 조회
    select(_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.findById(_id);
                resolve(result);
            } catch(err) {
                console.log(`선거 조회 오류: ${err}`);
                reject("선거 조회 실패");
            }
        });
    }

    // 선거 목록 조회
    selectAll(status) { // 선거 상태
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.find({ status: { $eq: status} });
                resolve(result);
            } catch(err) {
                console.log(`선거 목록 조회 오류: ${err}`);
                reject("선거 목록 조회 실패");
            }
        });
    }

    // 선거 상태 변경
    updateStatus(_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await Vote.updateOne({ _id }, { $inc: { status: 1 }})
                resolve("선거 상태 변경 성공");
            } catch(err) {
                console.log(`선거 상태 변경 오류: ${err}`);
                reject("선거 상태 변경 실패");
            }
        });
    }

    // 득표 수 업데이트 (투표)
    vote(_id, type, candidatesIdArray) { // 선거 id, 후보자 종류, 선거권자가 선택한 후보자 id 배열
        return new Promise(async (resolve, reject) => {
            try {
                candidatesIdArray.foreach(e => {
                    await Candidate.updateOne({ id: e }, { $inc: { votes: 1 } });
                });
                const count = candidatesIdArray.length;
                switch(type) {
                    case 1:
                        await Vote.updateOne({ _id }, { $inc: { votes1: count } });
                        break;
                    case 2:
                        await Vote.updateOne({ _id }, { $inc: { votes2: count } });
                        break;
                    case 3:
                        await Vote.updateOne({ _id }, { $inc: { votes3: count } });
                        break;
                    default:
                        break;
                }
                resolve(`투표 성공`);
            } catch(err) {
                console.log(`투표 오류: ${err}`);
                reject(`투표 실패`);
            }
        });
    }

    // 선거 삭제
    delete(_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await Vote.deleteOne({ _id });
                resolve("선거 삭제 성공");
            } catch(err) {
                console.log(err);
                reject("선거 삭제 실패");
            }
        });
    }
}

module.exports = new VoteModel();