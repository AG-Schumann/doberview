var createError = require('http-errors');
var express = require('express');
var path=require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const { MongoClient } = require('mongodb');
var uri = process.env.DOBERVIEW_MONGO_URI;
var db = MongoClient(uri);

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

// session caching
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var store_uri = process.env.DOBERVIEW_SESSION_URI;
var store = new MongoDBStore({
  uri: store_uri,
  collection: 'sessions'
});

store.on('connected', function() {store.client;});

var assert = require('assert');
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

app.use(session({
  secret: process.env.EXPRESS_SESSION,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week in ms
  },
  store: store,
  resave: true,
  saveUninitialized: false
}));

// Passport auth
var passport = require('passport');
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// aliases for paths
app.use('/bs', express.static(__dirname + '/node_modules/bootstrap3/dist'));
app.use('/jq', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/je', express.static(__dirname + '/node_modules/jsoneditor/dist'));

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// favicon
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// add our databases etc to the router
app.use((req, res, next) => {
  req.db = db;
  next();
});

// url routers
var indexRouter = require('./routes/index');

app.use('/', indexRouter);


// catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// make user object accessible to templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
