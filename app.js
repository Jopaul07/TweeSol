var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var multer = require('multer');

var io = require('./socket').io;
var app = express();
app.io = io;
var index = require('./routes/index');
var users = require('./routes/users');

const MongoStore = require('connect-mongo')(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//in git'ile
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("combined", { path: "log/express.log" }));
app.use(cookieParser());
app.use(session(
  {
    secret: "very secret",
    resave: false,
    cookie: { maxAge: 6000000 },
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }
));

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use('/', index);
app.use('/users', users);
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/tweesol', { useMongoClient: true });
// app.get('*', function(req, res){
//     res.redirect('/home');
// });


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;