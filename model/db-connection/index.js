const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb://d-voting:1234@localhost:27017/voting-app';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (err) => {
    console.log('Error : ', err);
});
db.on('open', () => {
    console.log('Open Event');
});
 
module.exports = db;