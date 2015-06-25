var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-02.cleardb.net',
  user     : 'b420131646c183',
  password : '8f72cbf2',
  database : 'heroku_ed009e298388bba'
});

connection.connect();

var sent=0;

/* GET home page. */
router.get('/', function(req, res) {
  connection.query('SELECT * from `portfolio` GROUP BY `id` ORDER BY `date` DESC LIMIT 4', function(err, results, fields) {
  if (err) throw err;
  if (!(req.query.message===undefined)){
  	 res.render('index', {results2: results, sent:req.query.message});
  }
  else{
  	res.render('index', {results2: results});
  }
  });
});

module.exports = router;

