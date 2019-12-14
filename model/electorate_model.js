const Electorate = require('./schema/electorate');
const Vote = require('./schema/vote');

class ElectorateModel {
    // 선거권자 목록 생성
    create(_id, electorates) { // 선거 id, 선거권자 목록
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Electorate.create(electorates);
                let idArray = new Array();
                result.forEach(e => {
                    let id = { _id: e._id };
                    idArray.push(id);
                });
                resolve(idArray);
            } catch(err) {
                console.log(`선거권자 목록 생성 오류: ${err}`);
                reject(`선거권자 목록 생성 실패`);
            }            
        });
    }

    // 선거권자 목록에 있는지 조회
    select(_id, name) { // 선거 id, 선거권자 name
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.find({ _id }).populate({ path: 'electorates', match: { name } }).exec();
                console.log(`Electorates select result: ${result}`);
                resolve(result);
            } catch (err) {
                console.log(`선거권자 조회 오류: ${err}`);
                reject("선거권자 조회 실패");
            }
        });
    }

    // 인증번호 생성 및 조회
    updateAuth(_id) { // 선거권자 id
        let auth = this.authGenerator(Math.floor(Math.random() * 10000), 4);
        return new Promise(async (resolve, reject) => {
            try {
                await Electorate.updateOne({ _id }, { $set: { auth } });
                resolve(auth);
            } catch(err) {
                reject(err);
            }
        });
    }

    // 선거권자 상태 변경
    updateStatus(_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await Electorate.updateOne({ _id }, { $inc: { status: 1 } });
                const result = await Electorate.findById(_id);
                if(result.status > 2) await Electorate.updateOne({ _id }, { completed: Date.now() });
                resolve(result);
            } catch(err) {
                reject(err);
            }
        });
    }

    // 인증번호용 앞에 0 채우기
    authGenerator(auth, len) {
        auth = auth + '';
        return auth.length >= len ? auth : new Array(len - auth.length + 1).join('0') + auth;
    }

    // 선거권자 삭제
    delete(_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Vote.findById(_id).select('-_id electorates');
                result.forEach(e => {
                    await Electorate.deleteOne({ _id: e._id });
                });
                await Vote.update({ _id }, { $unset: { electorates: 1 } });
                resolve(`선거권자 삭제 성공`);
            } catch(err) {
                console.log(`선거권자 삭제 오류: ${err}`);
                reject(`선거권자 삭제 실패`);
            }
        });
    }
}

module.exports = new ElectorateModel();