var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var nodemailer = require('nodemailer');


var router = express.Router();
var routes = require('./routes/index');
var portfolioRoutes = require('./routes/portfolio');
var projectRoutes = require('./routes/project');
var resumeRoutes = require('./routes/resume');
var editRoutes = require('./routes/edit');
var removeRoutes = require('./routes/remove');
var addRoutes = require('./routes/add');
var adminRoutes = require('./routes/admin');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon-32x32.png'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressSession({ 
  secret: process.env.SESSION_SECRET || 'secret' ,
  resave: false,
  saveUninitialized: false
}));


//DB CONNECTION
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


app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username, password, done){
  var username2=username;
  var password2=password;
  var values=[username2,password2];
  connection.query('SELECT * from `users` WHERE `username`=? AND `password`=?', values, function(err, results, fields) {
    if(err) throw err;
    if(results[0]!=undefined){
      done(null, { id:results[0].id , username:results[0].username });
    }
    else{
      done(null,false);
    }
  });
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  connection.query('SELECT `username` from `users` WHERE `id`=?', [id] , function(err, results, fields){
    if (err) throw err;
    done(null, { id:id, username:'tenhomeideia'});
  });
});

app.use(logger('dev'));
app.use(express.static('./public/'));
app.use('/', routes);
app.use('/', portfolioRoutes);
app.use('/', projectRoutes);
app.use('/', resumeRoutes);
app.use('/', addRoutes);
app.use('/', removeRoutes);
app.use('/', editRoutes);
app.use('/', adminRoutes);
app.use('/', express.static(__dirname + '/public'));
app.use('/portfolio', express.static(__dirname + '/public'));
app.use('/project', express.static(__dirname + '/public'));
app.use('/admin', express.static(__dirname + '/public'));
app.use('/add', express.static(__dirname + '/public'));
app.use('/remove', express.static(__dirname + '/public'));
app.use('/edit', express.static(__dirname + '/public'));

app.get('/', routes);

app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/admin');
});


app.post('/', function (req, res) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "ricardoalmmarques@gmail.com",
        pass: "ldcaqeuvyhylcrzu" 
    }
  });
  transporter.sendMail({
    to: 'ricardoalmmarques@gmail.com',
    subject: 'Portfolio page contact',
    text:req.body.message + '\n\xA0\n\xA0\n\xA0Sent by ' + req.body.email
  },function (error, response) {
      //Email not sent
      if (error) {
          res.redirect('/?message=error');
      }
      //Yay!! Email sent
      else {
          res.redirect('/?message=sent');
      }
    }
  );
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


// //development error handler
// //will print stacktrace
// if (process.env.NODE_ENV === 'production') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500)5;
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});


var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

})

module.exports = app;
