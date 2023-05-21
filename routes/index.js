let express = require('express');
let router = express.Router();
let Database = require('./database');
let db = new Database() 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/scoreboard', function(req, res, next) {
  res.render('scoreboard', { title: 'Express' });
});

router.post('/guardar', function(req, res, next) {
  db.afegirJugador(req.body.username, req.body.score)
});

router.get('/mostrarUsers', function(req, res, next){
  a = db.getPlayers(); 
  a.then((doc)=>doc)
  .then((arr) => {
    res.send(arr)
  })
})


module.exports = router;
