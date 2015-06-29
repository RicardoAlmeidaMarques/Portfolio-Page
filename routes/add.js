var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');
var mysql = require('mysql');
var fs = require('fs');

var getPortfolioItems= 'SELECT * from `portfolio` GROUP BY `id` ORDER BY `date` DESC';

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');
 
var db_config={
  host     : 'us-cdbr-iron-east-02.cleardb.net',
  user     : 'b420131646c183',
  password : '8f72cbf2',
  database : 'heroku_ed009e298388bba'
 };

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


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
     if(files.imagePath.name=='' && files.upload==undefined){
      connection.query('INSERT INTO `portfolio` SET `description`=?,`long_description`=?, `title`=?',
      [fields.description , fields.longDescription , fields.title , title]);
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
      connection.query('INSERT INTO `portfolio` SET `description`=?,`long_description`=?, `showcase_image`=?, `title`=?',
      [fields.description , fields.longDescription , images, fields.title , title])
    }
    else if(files.upload==undefined){
      connection.query('INSERT INTO `portfolio` SET `description`=?,`long_description`=?, `image_path`=?, `title`=?',
      [fields.description , fields.longDescription , files.imagePath.name , fields.title , title])
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
      connection.query('INSERT INTO `portfolio` SET `description`=?,`long_description`=?, `image_path`=?, `showcase_image`=?,`title`=?',
      [fields.description , fields.longDescription , files.imagePath.name , images , fields.title , title])
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