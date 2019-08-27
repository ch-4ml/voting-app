const adminRouter = express.Router();
const candidateModel = require('../model/candidate_model');
const electorateModel = require('../model/electorate_model')

// 새로운 선거 등록
adminRouter.post('/registerVote', (req, res) => {
  const vote = {
      title: req.body.title, 
      begin_date: req.body.begin_date, 
      end_date: req.body.end_date,
      limit: req.body.limit
  };
  voteModel.create(vote).then(result => {
      res.redirect('');
  }).catch(err => {
      res.redirect('', {err: err});
  });
});

// 새로운 후보자 등록
adminRouter.post('/registerCandidate', (req, res) => {
    let candidates = new Array();
    for(let i = 0; i < req.body.data.length; i++) {
        let candidate = {
            vote_id: req.body.data[i].voteId,
            name: req.body.data[i].name,
            name_ex: req.body.data[i].name_ex,
            phone: req.body.data[i].phone,
            image: image,
            votes: 0
        };
        candidates.push(candidate);
    }
    candidateModel.registerCandidate(candidates).then(result => {
        res.redirect('');
    }).catch(err => {
        res.redirect('', {err: err});
    });
});

// 새로운 선거권자 등록
adminRouter.post('/registerElectorate', (req, res) => {
    let electorates = new Array();
    for(let i = 0; i < req.body.data.length; i++) {
        let auth = Math.floor(Math.random() * 10000);
        let electorate = {
            vote_id: req.body.data[i].voteId,
            name: req.body.data[i].name,
            name_ex: req.body.data[i].name_ex,
            birthday: req.body.data[i].birthday,
            phone: req.body.data[i].phone,
            image: image, // 아직
            auth: authGenerator(auth, 4),
            vote_time: null
        };
        electorates.push(electorate);
    }
    
    electorateModel.registerElectorate(electorates).then(result => {
        res.redirect('');
    }).catch(err => {
        res.redirect('', {err: err});
    });
});

// 관리자가 선거권자의 인증번호 조회
adminRouter.get('/queryAuth/:voteId/', (req, res) => {
    // 관리자인지 확인

    res.redirect('');
});

adminRouter.post('/queryAuth/:voteId/', (req, res) => {
    
});

// 인증번호용 앞에 0 채우기
function authGenerator(auth, len) {
    auth = auth + '';
    return auth.length >= len ? auth : new Array(len - auth.length + 1).join('0') + auth;
}

module.exports = adminRouter;