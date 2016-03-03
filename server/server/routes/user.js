// user.js - user routes

var express = require('express');
var router = express.Router();

var checkRole = require('../functions/helperFunctions/checkRole');
var models = require('../models'),
    User = models.User;

// ROUTES =========================================
// middleware that is specific to this router
console.log('touched users');

router.use(checkRole);

// define the home page route
router.get('/', function(req, res) {
  
  User.find().exec((err, next) => {
    if (err) { console.error(err); }
    res.json(next);
  });
});

// define the about route
router.get('/about', function(req, res) {
  res.send('About icons');
});

module.exports = router;