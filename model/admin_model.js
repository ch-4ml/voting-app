const db = require('./connect');

class Admin {
    create(admin) {
        return new Promise(async (resolve, reject) => {
            let sql = 'INSERT INTO admin SET ?';
            try {
                let result = await db.query(sql, admin);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    select(admin) {
        return new Promise(async (resolve, reject) => {
            let sql = 'SELECT * FROM admin WHERE UID = ? AND PASSWORD = ?';
            try {
                let result = await db.query(sql, admin);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = new Admin();