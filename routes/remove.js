var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');
var connection = require('../db_helper');

var getPortfolioItem = 'SELECT * from `portfolio` WHERE `title`=?';

router.get('/remove/:title', function(req, res) {
    var title=req.params.title;  
    connection.query('DELETE from `portfolio` WHERE `title`=?',[title], function(err, results, fields) {
      if (err) throw err;
      res.redirect('/admin');
    });
});

module.exports = router;