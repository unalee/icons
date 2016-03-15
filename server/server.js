// server.js
// what we call to turn the app on.
'use strict';

// modules ==========================================================
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var _ = require('lodash');

// Turn the app on
var server = http.createServer(app);
var mongoose = require('mongoose');
var passport = require('passport');

// EXPRESS MODULES ==================================================
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Detailed logging ================
app.use(morgan('combined'));

// SESSION STORAGE ==================================================
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});

// PROCESS PORTS =====================================================
var port = Number(process.env.PORT || 8081);

// GLOBAL VARIABLES =================================================
if (!process.env.APP_SECRET_KEY) {
  var secrets = require(path.join(__dirname, 'secrets'));
  app.locals = _.merge(app.locals, secrets);
} else {
  app.locals.cookie_name = 'connect.sid'
  app.locals.secret = process.env.APP_SECRET_KEY
}

// CONFIGURATION ====================================================
global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
};

// express 4.0 basic configuration ==================================
app.use(cookieParser());
app.use(express.static(__dirname + '/frontend'));
app.use(bodyParser());

// passport configuration ===========================================
require('./config/passport')(app, passport);

// Database summoning ===============================================
var database = require('./config/db');
var db = database.db;

// session start ====================================================
app.use(session({
  secret: process.env.APP_SECRET_KEY || app.locals.secret,
  cookie: {
    path: '/',
    expires: false, // Alive Until Browser Exits
    // secure: true, // TODO: implement https
    httpOnly: true
  },
  store: sessionStore,
  saveUninitialized: true, // (default: true)
  resave: true // (default: true)
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// server /api/ routes ==============================================
var auth = require('./server/routes/auth');
app.use('/auth', auth);

var api = require('./server/routes/router');
app.use('/api', api);

app.use('/docs', function(req, res) {
  res.sendFile(__dirname + '/frontend/docs/index.html');
});

app.use('*', function(req, res) {
  res.sendFile(__dirname + '/frontend/index.html');
});

// DEFAULT ROUTE ====================================================
// app.get('*', function(req, res) {
// 	res.sendFile(__dirname + '/frontend/src/index.html');
// });

// Turn it on
server.listen(port, function() {
  console.log('listening on', port);

  // rough listing of available endpoints on console.
  require('./endpoint')(app._router.stack, 'express');
});

// EXPOSE APP AS OBJECT =============================================
exports = module.exports = app;
