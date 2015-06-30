var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');
var connection = require('../db_helper');
var fs = require('fs');

var getPortfolioItem = 'SELECT * from `portfolio` WHERE `title`=?';
var getPortfolioItems= 'SELECT * from `portfolio` GROUP BY `id` ORDER BY `date` DESC';

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');


router.get('/edit/:title', function(req, res) {
	var title=req.params.title;
  	connection.query( getPortfolioItem, [title], function(err , results, fields){
	    if (err) throw err;
	    var images=results[0].showcase_image;
      if (images!=null){
	     var imageArray= images.split(",");
      }
	    res.render('edit', {
	     isAuthenticated: req.isAuthenticated(),
	     user:req.user,
	     project: results[0],
       year:results[0].date.getFullYear(),
       month:results[0].date.getMonth()+1,
       day:results[0].date.getDate(),
	     imageArray:imageArray
	    });
  });
});

router.post('/edit/:title', function(req,res) {
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
      connection.query('UPDATE `portfolio` SET `description`=?,`long_description`=?, `date`=?, `url`=?, `title`=? WHERE `title`=?',
      [fields.description , fields.longDescription , fields.date , fields.url , fields.title , title]);
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
      connection.query('UPDATE `portfolio` SET `description`=?,`long_description`=?, `showcase_image`=?,`date`=?, `url`=?, `title`=? WHERE `title`=?',
      [fields.description , fields.longDescription , images , fields.date , fields.url,  fields.title , title])
    }
    else if(files.upload==undefined){
      connection.query('UPDATE `portfolio` SET `description`=?,`long_description`=?, `image_path`=?,`date`=?, `url`=?, `title`=? WHERE `title`=?',
      [fields.description , fields.longDescription , files.imagePath.name , fields.date, fields.url,  fields.title , title])
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
      connection.query('UPDATE `portfolio` SET `description`=?,`long_description`=?, `image_path`=?, `showcase_image`=?,`date`=?, `url`=?, `title`=? WHERE `title`=?',
      [fields.description , fields.longDescription , files.imagePath.name , images , fields.date , fields.url, fields.title , title])
    }
    connection.query(getPortfolioItems, function(err , results, fields){
      if (err) throw err;
      res.render('admin', {
       isAuthenticated: req.isAuthenticated(),
       user:req.user,
       portfolio: results
      });
    })
  });
});

module.exports = router;