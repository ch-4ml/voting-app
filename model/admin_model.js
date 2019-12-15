const Admin = require('./schema/admin');

class AdminModel {
    create(admin) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await new Admin(admin).save();
                console.log(`Admin sign up result: ${result}`);
                resolve(`관리자 계정 생성 성공`);
            } catch (err) {
                console.log(`관리자 생성 오류: ${err}`);
                reject("관리자 생성 실패");
            }
        });
    }

    select(admin) { // 아이디(phone), 비밀번호
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Admin.findOne({ 'phone': admin.phone, "pw": admin.pw }).exec();
                console.log(`Admin select result: ${result}`);
                resolve(result);
            } catch (err) {
                console.log(`관리자 조회 오류: ${err}`);
                reject("관리자 조회 실패");
            }
        });
    }
}

module.exports = new AdminModel();

// class Admin {
//     create(admin) {
//         return new Promise(async (resolve, reject) => {
//             let sql = 'INSERT INTO admin SET ?';
//             try {
//                 let result = await db.query(sql, admin);
//                 resolve(result);
//             } catch (err) {
//                 console.log(err);
//                 reject(err);
//             }
//         });
//     }

//     select(admin) {
//         return new Promise(async (resolve, reject) => {
//             let sql = "SELECT * FROM admin WHERE UID = '" + admin.uid + "' AND PASSWORD = '" + admin.password + "'";
//             try {
//                 let result = await db.query(sql);
//                 resolve(result);
//             } catch (err) {
//                 console.log(err);
//                 reject(err);
//             }
//         });
//     }
// }

// module.exports = new Admin();