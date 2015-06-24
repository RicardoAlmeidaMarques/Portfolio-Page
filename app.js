var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var nodemailer = require('nodemailer');
var routes = require('./routes/index');
var portfolioRoutes = require('./routes/portfolio');
var resumeRoutes = require('./routes/resume');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.get('/', routes);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon-32x32.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public/'));
app.use('/', routes);
app.use('/', portfolioRoutes);
app.use('/', resumeRoutes);
app.use('/', express.static(__dirname + '/public'));
app.use('/portfolio', express.static(__dirname + '/public'));


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


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

})



module.exports = app;
