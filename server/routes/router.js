// routes.js
// main file for API routes, which are further divided in folders
'use strict';

var express = require('express');
var router = express.Router();

// Module Dependencies

// Route documents
var auth = require('./auth');
var api = require('./api');

// var tokenExists = require('../functions/accountFunctions/token-exists-check');

router.get('/api', (req, res) => {
  console.log('get icon path');
  res.json('touched api');
})


router.use('/auth', auth);

// MIDDLEWARE TO BLOCK NON-AUTHORIZED USERS =============================================
// route middleware to ensure user is logged in

// router.use(tokenExists);
// router.use('/api', function(req, res, next) {
//   // make sure calls to the API have a valid token.
//   console.log('touched api');
//   next();
// });
// router.use('/api', api);


module.exports = router;
