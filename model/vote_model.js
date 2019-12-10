const Vote = require('./schema/vote');

class VoteModel {
    // 새 선거 생성
    create(vote) {
        return new Promise(async (resolve, reject) => {
            const v = new Vote(vote);
            try {
                await v.save();
                resolve("선거 생성 성공");
            } catch(err) {
                console.log(`선거 생성 오류: ${err}`);
                reject("선거 생성 실패");
            }
        });
    }

    // 후보자 등록
    updateCandidates(id, type, candidates) {
        return new Promise(async (resolve, reject) => {
            let text = "";
            try {
                switch(type) {
                    case 0:
                        await Vote.updateOne({ id: id }, { candidates1: candidates });
                        text = "장로 등록 성공";
                        break;
                    case 1:
                        await Vote.updateOne({ id: id }, { candidates2: candidates });
                        text = "안수집사 등록 성공";
                        break;
                    case 2:
                        await Vote.updateOne({ id: id }, { candidates3: candidates });
                        text = "권사 등록 성공";
                        break;
                    default:
                        text = "잘못된 값"
                        break;
                }
                resolve(text);
            } catch(err) {
                console.log(`후보자 등록 오류: ${err}`);
                reject(`후보자 등록 실패`);
            }
        });
    }

    // 선거권자 등록
    updateElectorates(id, electorates) {
        return new Promise(async (resolve, reject) => {
            try {
                await Vote.updateOne({ id: id }, { electorates: electorates });
                resolve("선거권자 등록 성공");
            } catch(err) {
                console.log(`선거권자 등록 오류: ${err}`);
                reject("선거권자 등록 실패");
            }
        });
    }

    // 선거 조회
    select(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.findById(id);
                resolve(result);
            } catch(err) {
                console.log(`선거 조회 오류: ${err}`);
                reject("선거 조회 실패");
            }
        });
    }

    // 선거 목록 조회
    selectAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.find({ status: { $gt: 0} });
                resolve(result);
            } catch(err) {
                console.log(`선거 목록 조회 오류: ${err}`);
                reject("선거 목록 조회 실패");
            }
        });
    }

    // 선거 상태 변경
    updateStatus(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await Vote.updateOne({ id: id }, { $inc: { status: 1 }})
                resolve("선거 상태 변경 성공");
            } catch(err) {
                console.log(`선거 상태 변경 오류: ${err}`);
                reject("선거 상태 변경 실패");
            }
        });
    }

    // 선거 삭제
    delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await Vote.deleteOne({ id: id });
                resolve("선거 삭제 성공");
            } catch(err) {
                console.log(err);
                reject("선거 삭제 실패");
            }
        });
    }
}

module.exports = new VoteModel();