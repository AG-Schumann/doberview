var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

const { MongoClient } = require('mongodb');
var uri = process.env.DOBERVIEW_MONGO_URI;
var db = MongoClient(uri);

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

// session caching
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var store_uri = process.env.DOBERVIEW_MONGO_URI;
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
  secret: 'secret-key', //process.env.EXPRESS_SESSION,
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
const isLoggedIn = require('./routes/common')
app.get('/', isLoggedIn, (req,res)=>{
res.send(`Hello world ${req.user.displayName}`)
})
app.get('/auth/error', (req, res) => res.send('Unknown Error'))
app.get('/auth/github',passport.authenticate('github',{ scope: [ 'user:email' ] }));
app.get('/auth/github/callback',passport.authenticate('github', { failureRedirect: '/auth/error' }),
function(req, res) {
  res.redirect('/');
});
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})
// aliases for paths
app.use('/bs', express.static(__dirname + '/node_modules/bootstrap3/dist'));
app.use('/jq', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/je', express.static(__dirname + '/node_modules/jsoneditor/dist'));

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// favicon
//var favicon = require('serve-favicon');
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// add our databases etc to the router
app.use((req, res, next) => {
  req.db = db;
  next();
});

// url routers
var indexRouter = require('./routes/overview');

app.use('/', indexRouter);


// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// make user object accessible to templates
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
