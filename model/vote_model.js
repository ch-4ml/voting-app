const Vote = require('./schema/vote');
// 투표할 때 추가해야 될 것 같아서 추가했읍니다.......... 잘했어
const Candidate = require('./schema/candidate');
const Electorate = require('./schema/electorate');

class VoteModel {
    // 새 선거 생성
    create(vote) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await new Vote(vote).save();
                console.log(`Create vote result: ${result}`);
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
                console.log("선거권자 등록 성공");
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
    vote(vid, eid, type, candidatesIdArray) { // 선거 id, 후보자 종류, 선거권자가 선택한 후보자 id 배열
        return new Promise(async (resolve, reject) => {
            try {
                candidatesIdArray.forEach(async e => {
                    try {
                        await Candidate.update({ _id: e }, { $inc: { votes: 1 } });
                    } catch (err) {
                        console.log(`투표 오류: ${err}`);
                        reject(`투표 실패`);
                    }
                });
                const count = candidatesIdArray.length;
                switch(type) {
                    // 혹시나... 해서 앞에 _id:를 붙여보았읍니다
                    case "1":
                        await Vote.update({ _id: vid }, { $inc: { votes1: count } });
                        await Electorate.update({ _id: eid }, { $set: { status: 1 }});
                        break;
                    case "2":
                        await Vote.update({ _id: vid }, { $inc: { votes2: count } });
                        await Electorate.update({ _id: eid }, { $set: { status: 2 }});
                        break;
                    case "3":
                        await Vote.update({ _id: vid }, { $inc: { votes3: count } });
                        await Electorate.update({ _id: eid }, { $set: { status: 3 }});
                        break;
                    default:
                        break;
                }
                const vResult = await Vote.findById(vid);
                const eResult = await Electorate.findById(eid);
                console.log(`Vote result: ${vResult}`);
                const result = { vResult, eResult };
                resolve(result);
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