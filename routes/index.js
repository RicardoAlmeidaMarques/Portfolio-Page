var express = require('express');
var router = express.Router();


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'portfolio'
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res) {
  connection.query('SELECT * from `portfolio` GROUP BY `id` ORDER BY `date` DESC LIMIT 4', function(err, results, fields) {
  if (err) throw err;
  console.log(results);
  res.render('index', {results2: results});
  });
});

module.exports = router;
