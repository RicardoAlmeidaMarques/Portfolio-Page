var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');
var fs = require('fs');
var connection = require('../db_helper');
var getPortfolioItems= 'SELECT * from `portfolio` GROUP BY `id` ORDER BY `date` DESC';

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

router.get('/add', function(req, res) {
  res.render('add', {
   isAuthenticated: req.isAuthenticated(),
   user:req.user,
  });
});

router.post('/add', function(req,res) {
  // parse a file upload 
  var title=req.params.title;
  var form = new formidable.IncomingForm();
  form.uploadDir = "public/images/portfolio/";
  form.multiples = 'md5';
  form.keepExtensions = true;
  form
      .on('fileBegin', function(name, file) {
      file.path = form.uploadDir + "/" + file.name;
  })

  form.parse(req, function(err, fields, files) {
     if(files.imagePath.name=='' && files.upload.name==''){
      connection.query('INSERT INTO `portfolio` SET `description`=?,`long_description`=?, `date`=?, `url`=?, `title`=?',
      [fields.description , fields.longDescription , fields.date, fields.url, fields.title]);
    }
    else if(files.imagePath.name==''){
      if (files.upload[0]==undefined)
      {
        var images=files.upload.name;
      }
      else{
        var images='';
      }
      var i=0;
      while(files.upload[i]!=undefined){
        images+=files.upload[i].name;
        i++;
        if(files.upload[i]!=undefined){
          images+=',';
        }
      }
      connection.query('INSERT INTO `portfolio` SET `description`=?,`long_description`=?, `showcase_image`=?, `date`=?, `url`=?,  `title`=?',
      [fields.description , fields.longDescription , images, fields.date, fields.url, fields.title])
    }
    else if(files.upload==undefined){
      connection.query('INSERT INTO `portfolio` SET `description`=?,`long_description`=?, `image_path`=?, `date`=?, `url`=?, `title`=?',
      [fields.description , fields.longDescription , files.imagePath.name , fields.date, fields.url, fields.title])
    }
    else if(files.imagePath.name!='' && files.upload!=undefined){
      var images='';
      var i=0;
      while(files.upload[i]!=undefined){
        images+=files.upload[i].name;
        i++;
        if(files.upload[i]!=undefined){
          images+=',';
        }
      }
      connection.query('INSERT INTO `portfolio` SET `description`=?,`long_description`=?, `image_path`=?, `showcase_image`=?,  `date`=?, `url`=?, `title`=?',
      [fields.description , fields.longDescription , files.imagePath.name , images , fields.date, fields.url, fields.title]) 
    }
    connection.query(getPortfolioItems, function(err , results, fields){
      if (err) throw err;
      res.redirect('admin');
    });
  });
});

module.exports = router;