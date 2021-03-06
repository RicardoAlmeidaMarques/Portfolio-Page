var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var db_config = {
  connectionLimit : 10,
  host     : '',
  user     : '',
  password : '',
  database : ''
 };


var pool =  module.exports = mysql.createPool(db_config);


function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }        

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

pool.getConnection();