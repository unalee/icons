// auth.js - authentication and passport routes

var express = require('express');
var auth = express.Router();
var passport = require('passport');

var config = require('../../secrets');
var User = require('../models/auth/user');
var fn = require('../functions');

// Module dependencies
var jwt = require('jsonwebtoken');


// process the signup form
auth.post('/signup', function(req, res) {

  if (!req.body.email || !req.body.password) {
    console.log('missing signup info');
    res.json({
      error: 'Email and Password required'
    });
  } else {

    passport.authenticate('local-signup', function(err, reply) {
      if (err) { console.error(err); }
      var expiresInMinutes = 1440 * 60;

      if (reply._id) { // if the reply has an _id, it is a user.
        var token = jwt.sign(reply, config.secret, {
          expiresIn: expiresInMinutes
        });

        res.json({
          token: token
        });

      } else {
        res.json(reply);
      }
    })(req, res);
  }
});


// LOGIN ROUTES ===========================================
// process the login form
auth.post('/login', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.json({
      error: 'Email and Password required'
    });
  }

  // console.log('log me in, jim', req.body);
  passport.authenticate('local-login', function(err, user) {
    if (err) {
      return res.json(err);
    }
    if (user.error) {
      return res.json({
        error: user.error
      });
    }
    var expiresInMinutes = 1440 * 60;
    var token = jwt.sign(user, config.secret, {
      expiresIn: expiresInMinutes
    });

    res.json({
      token: token,
      user: user
    });

  })(req, res, next);
});

auth.post('/logout', function(req, res) {
  req.logout();
  // TODO in here, destroy the auth token.
  res.json({
    redirect: '/login'
  });
});

auth.post('/token', (req, res) => {
  var token = req.body.token || req.query.token || req.headers[
    'x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        res.status(403).send('Token Invalid');
      } else {
        res.status(200).send('Token Valid');
      }
    });
  } else {
    res.status(403).send('Token Invalid');
  }
});


// PASSWORD RESET ROUTES ==================================
// forgotten passwords
auth.post('/forgot', function(req, res, next) {
  fn.forgotPasswordToken(req.body.email, function(err, tokenObject) {
    res.json({
      token: tokenObject
    });
  });
});

// password reset routes
auth.get('/reset/:token', function(req, res) {
  // is there a user with that token?
  models.User.findOne({
    'resetPasswordToken': req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (!user) {
      res.send('0');
    }
    res.send(1);
  });
}).post('/reset/:token', function(req, res) {
  // password reset route
  fn.resetPassword(req.params.token, req.body.password, app, function(err,
    resetUserLogin) {
    if (err) {
      console.error(err);
    }
    if (resetUserLogin === 0) {
      res.send('0');
    } else {
      console.log(
        'Successful Password Reset (should be able to automatically log in)',
        resetUserLogin);
      res.send(resetUserLogin);
    }
  });
});


// PUBLIC ROUTES ==========================================
auth.route('/invite/:_id')
  .get(function(req, res) {
    // get an existing Invite to populate the registration page
    models.Invite.findById(req.params._id)
      .select('invite_email')
      .exec(function(err, invite) {
        if (err) {
          return
        }
        res.json(invite);
      });
  });


module.exports = auth;
