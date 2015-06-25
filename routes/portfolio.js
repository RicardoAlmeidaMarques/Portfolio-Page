var express = require('express');
var router = express.Router();
var mysql      = require('mysql');

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