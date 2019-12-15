// Import modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors'); // cross domain issue
const timeModule = require('./modules/time');
const corsOptions = {
    origin: true,
    credentials: true
};

const app = express();

// Template Engine
app.set('view engine', 'ejs');
// Template File Location
app.set('/', __dirname + '/front/src');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// Router
const router = require('./router/router');
app.use(router);

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.get('/testExpress', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

// Server initialize
app.listen(3000, async () => {
    console.log("Run server");
    try {
        await timeModule.initVoteStatus();
    } catch (err) {
        console.log(err);
    }
});