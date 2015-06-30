var express = require('express');
var router = express.Router();
var connection = require('../db_helper');


router.get('/portfolio', function(req, res) {
  connection.query('SELECT * from `portfolio` GROUP BY `id` ORDER BY `date` DESC', function(err, results, fields) {
    if (err) throw err;
    res.render('portfolio', {results2:results});
  });
});

module.exports = router;