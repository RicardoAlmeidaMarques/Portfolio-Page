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

router.get('/portfolio', function(req, res) {
  connection.query('SELECT * from `portfolio` GROUP BY `id` ORDER BY `date` DESC', function(err, results, fields) {
    if (err) throw err;
    res.render('portfolio', {results2:results});
  });
});

router.get('/portfolio/:title', function(req, res) {
    var title=req.params.title;
    connection.query('SELECT * from `portfolio` WHERE `title`=?',[title], function(err, results, fields) {
      if (err) throw err;
      var images=results[0].showcase_image;
      var imageArray= images.split(",");
      res.render('portfolio', {results2:[],results3:results,images:imageArray});
    });
});

module.exports = router;