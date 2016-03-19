// forgot-password-token
// reset a user's password and send them a token for setting their account
'use strict';

module.exports = function(emailAddress, next){
// Module dependencies ==========================
    var async   = require('async');
    
    var Bluebird = require('bluebird');
    var generateToken = Bluebird.promisify(require("crypto").randomBytes);
    
    var models = require('../../models');

    var User = Bluebird.promisifyAll(require('../../models/auth/user'));

// SEND A LOST PASSWORD TOKEN =============================
    

    generateToken(20).then(function(token){
        token = token.toString('hex');
        return User.findOneAsync({ 'email': emailAddress })
        .then(function(user){
            // console.log(user);
            if(user !== 'undefined' && user !== null){
                user.resetPasswordToken = token;
                var tomorrow = new Date();
                user.resetPasswordExpires = tomorrow.setDate(tomorrow.getDate() + 1);

                user.save(function(err, done){
                    // TODO: Bind this to AWS SNS services.
                    if(err){console.error(err);}
                    if(done.resetPasswordToken){
                        next(null, 1);
                    } else {
                        next(null, 'error');
                    }
                })
            } else {
                next(null, 'No user with that e-mail exists.');
            }
        })
    }).catch(function(err){
        if(err){console.error(err);}
    })
};