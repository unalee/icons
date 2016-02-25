// api.js - api routes

var express = require('express');
var router = express.Router();


// ROUTES =========================================
    // require('./routes/invite-routes')(app);
    // require('./user-routes')(app);
    

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', function(req, res) {
  res.send('Icons.get');
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About icons');
});

module.exports = router;