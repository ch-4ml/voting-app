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
                console.log(`id in select: ${_id}`);
                const result = await Vote.find({ _id: _id }).populate({ path: 'electorates', match: { name: { $regex: '.*' + name + '.*' } } }).exec();
                console.log(`Electorates select result: ${result[0].electorates.length}`);
                resolve(result[0].electorates);
            } catch (err) {
                console.log(`선거권자 조회 오류: ${err}`);
                reject("선거권자 조회 실패");
            }
        });
    }

    // 선거권자 전체 조회
    selectAll(_id) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(`id in selectAll: ${_id}`);
                const result = await Vote.find({ _id: _id }).populate({ path: 'electorates' }).exec();
                console.log(`Electorates select result: ${result[0].electorates.length}`);
                resolve(result[0].electorates);
            } catch (err) {
                console.log(`선거권자 조회 오류: ${err}`);
                reject("선거권자 조회 실패");
            }
        });
    }

    count(_id) {
        return new Promise(async (resolve, reject) => {
            try {                
                console.log(`id in count: ${_id}`);
                const result = await Vote.find({ _id: _id }).populate({ path: 'electorates', match: { status: 1 } }).exec();
                const count = result[0].electorates.length;
                console.log(`Current checked electorates count: ${count}`);
                resolve(count);
            } catch (err) {
                console.log(`현재 투표용지 수령 확인된 선거권자 수 조회 오류: ${err}`);
                reject("현재 투표용지 수령 확인된 선거권자 수 조회 실패");
            }
        })
    }

    // 인증번호 생성 및 조회
    updateAuth(_id) { // 선거권자 id
        let auth = this.authGenerator(Math.floor(Math.random() * 10000), 4);
        return new Promise(async (resolve, reject) => {
            try {
                await Electorate.updateOne( { _id: _id }, { $set: { auth: auth } });
                console.log(`인증번호 생성 성공`);
                resolve(auth);
            } catch(err) {
                console.log(`인증번호 생성 오류: ${err}`);
                reject(`인증번호 생성 실패`);
            }
        });
    }

    // 선거권자 상태 변경
    updateStatus(_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await Electorate.updateOne({ _id }, { $set: { status: 1, completed: Date.now() } });
                const result = await Electorate.findById(_id);
                resolve(result);
            } catch(err) {
                console.log(err);
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
                result.forEach(async e => {
                    try {
                        await Electorate.deleteOne({ _id: e._id });
                    } catch(err) {
                        console.log(`선거권자 삭제 오류: ${err}`);
                        reject('선거권자 삭제 실패');
                    }
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