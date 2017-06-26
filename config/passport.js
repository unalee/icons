// config/passport.js
'use strict';

// expose this function to our app using module.exports
module.exports = function(app, passport) {

  // load all the things we need
  var LocalStrategy = require('passport-local').Strategy;

  var bcrypt = require('bcrypt');
  var mongoose = require('mongoose');
  var _ = require('lodash');

  // functions 
  var fn = require('../server/functions');

  // load up the user model
  var User = require('../server/models/auth/user');
  var Invitation = require('../server/models/auth/invitation');

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  // Temporarily removed because we are no longer using session signups

  // used to serialize the user for the session
  // passport.serializeUser(function(user, done) {
  //     done(null, user.id);
  // });

  // // used to deserialize the user
  // passport.deserializeUser(function(id, done) {
  //     User.findById(id, function(err, user) {
  //         // console.log('serialized user?', user);
  //         done(err, user);
  //     });
  // });

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  }, function(req, email, password, done) {
    if (email) {
      email = email.toLowerCase();
    } // Use lower-case e-mails to avoid case-sensitive e-mail matching
    console.log(email, password)
    // asynchronous
    process.nextTick(function() {

      User.findOne({
        'email': email
      }).select('+password').exec(function(err, user) {
        if (err) { return done(err); }

        // if no user is found, return the message
        if (!user) {
          return done(null, {
            error: 'User not found.'
          });
        }

        if (!user.comparePassword(password)) {
          return done(null, {
            error: 'Oops! Wrong password.'
          });
        }

        if (user) {
          var jsonUser = user.toJSON();
          delete jsonUser.password

          return done(null, jsonUser);
        }
        
      });
    });
  }));

  // =========================================================================User
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
      if (req.user) {
        return done(null, 'Please log out before creating a new user.');
      }

      User.create(req.body, function(err, user) {
        if (err) {
          if (11000 === err.code || 11001 === err.code) {
            done(null, 'That user already exists.');
          }
        } else {
          user.save(function(err, data) {
            done(err, data);
          });
        }
      });

    }));
};
