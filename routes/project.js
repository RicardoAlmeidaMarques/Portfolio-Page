var express = require('express');
var router = express.Router();
var connection = require('../db_helper');

router.get('/project/:title', function(req, res) {
    var title=req.params.title;
    connection.query('SELECT * from `portfolio` WHERE `title`=?',[title], function(err, results, fields) {
      if (err) throw err;
      var images=results[0].showcase_image;
      var imageArray= images.split(",");
      res.render('project', {results3:results,images:imageArray});
    });
});

router.get('/project' , function(req, res) {
    res.redirect('/');
  });

module.exports = router;