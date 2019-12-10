class Electorate {
    // 선거권자 목록에 있는지 조회
    select(id, name) { // 선거 id, 선거권자 name
        return new Promise(async (resolve, reject) => {
            try {
                const result = await 
            } catch (err) {
                console.log(`선거권자 조회 오류: ${err}`);
                reject("선거권자 조회 실패");
            }
        });
    }

    // 인증번호 생성 및 조회
    updateAuth(id) {
        let auth = this.authGenerator(Math.floor(Math.random() * 10000), 4);
        return new Promise(async (resolve, reject) => {
            let sql = 'UPDATE electorate SET AUTH = ? WHERE ID = ?';
            try {
                await db.query(sql, [auth, id]);
                resolve(auth);
            } catch(err) {
                reject(err);
            }
        });
    }

    // 투표 완료 시간 저장
    updateVoteTime(electorate) {
        return new Promise(async (resolve, reject) => {
            let sql = 'UPDATE electorate SET VOTE_TIME = NOW() WHERE ID = ?';
            try {
                let result = await db.query(sql, electorate.id);
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
    delete(voteId) {
        return new Promise(async (resolve, reject) => {
            let sql = 'DELETE FROM electorate WHERE vote_id = ?';
            try {
                let result = await db.query(sql, voteId);
                resolve(result);
            } catch(err) {
                reject(err);
                console.log(err);
            }
        });
    }
}

module.exports = new Electorate();