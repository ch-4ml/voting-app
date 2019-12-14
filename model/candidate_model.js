const Candidate = require('./schema/candidate');
const Vote = require('./schema/vote');

class Candidate {
    // 후보자 추가
    create(_id, candidates) { // 선거 id, 후보자 목록
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Candidate.create(candidates);
                let idArray = new Array();
                result.forEach(e => {
                    let id = { _id: e._id };
                    idArray.push(id);
                });
                resolve(idArray);
            } catch(err) {
                console.log(`후보자 목록 생성 오류: ${err}`);
                reject(`후보자 목록 생성 실패`);
            }            
        });
    }

    // 후보자 목록 조회
    select(_id, type) { // 선거 id, 후보자 종류(1, 2, 3)
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.find({ _id }).populate({ path: `candidates${type}`}).exec();
                console.log(`Candidates${type} select result: ${result}`);
                resolve(result);
            } catch(err) {
                console.log(`후보자 목록 조회 오류: ${err}`);
                reject(`후보자 목록 조회 실패`);
            }
        });
    }

    // 선거 결과(득표 수) 조회
    result(_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const candidates1 = await Vote.find({ _id }).populate({ path: 'candidates1'}).exec();
                const candidates2 = await Vote.find({ _id }).populate({ path: 'candidates2'}).exec();
                const candidates3 = await Vote.find({ _id }).populate({ path: 'candidates3'}).exec();
                const result = { candidates1, candidates2, candidates3}
                console.log(`Vote result select result: ${result}`);
                resolve(result);
            } catch(err) {
                console.log(`선거 결과 조회 오류: ${err}`);
                reject(`선거 결과 조회 실패`);
            }
        });
    }

    // 후보자 삭제
    delete(_id, type) { // 투표 id, 후보자 종류(1, 2, 3)
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.findById(_id).select(`-_id candidates${type}`);
                result.forEach(e => {
                    await Candidate.deleteOne({ _id: e._id });
                });
                let text = "";
                switch(type) {
                    case 1:
                        await Vote.update({ _id }, { $unset: { candidates1: 1 } });
                        text = "장로 삭제 성공";
                        break;
                    case 2:
                        await Vote.update({ _id }, { $unset: { candidates2: 1 } });
                        text = "안수집사 삭제 성공";
                        break;
                    case 3:
                        await Vote.update({ _id }, { $unset: { candidates3: 1 } });
                        text = "권사 삭제 성공";
                        break;
                    default:
                        text = "잘못된 값"
                        break;
                }
                resolve(text);
            } catch(err) {
                console.log(`후보자 삭제 오류: ${err}`);
                reject(`후보자 삭제 실패`);
            }
        });
    }
}

module.exports = new Candidate();