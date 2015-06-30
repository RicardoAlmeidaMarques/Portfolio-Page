var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');
var connection = require('../db_helper');
var getPortfolioItems= 'SELECT * from `portfolio` GROUP BY `id` ORDER BY `date` DESC';

router.get('/admin', function(req, res) {
  connection.query(getPortfolioItems, function(err , results, fields){
    if (err) throw err;
    res.render('admin', {
     isAuthenticated: req.isAuthenticated(),
     user:req.user,
     portfolio: results
    });
  });
});

router.post('/admin', passport.authenticate('local', {
  failureRedirect: '/admin?error',
  successRedirect: '/admin'
}));

module.exports = router;