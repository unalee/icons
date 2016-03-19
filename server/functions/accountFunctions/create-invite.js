// create-invite.js
// Create a new Invite
'use strict';

module.exports = function(address, inviter, next){

// Module dependencies ====================================
    var mongoose = require('mongoose');  // Permits use of ObjectID type
    var _        = require('lodash');
    var async    = require('async');
    var Promise  = require('bluebird');
    
    var models   = require('../../models');

// Load models ============================================
    var Emailer = require('../models/mailer');

// Create an Invite ===================================
    async.waterfall([
        function(callback){
            models.User.findOne({'email' : address })
                .exec(function(err, user){
                    if(!user){
                        // if there is no user, set user to null.
                        callback(null, null);
                    }
                    else {
                        // otherwise pass along the user.
                        callback(null, user.email+' already has a '+ ENV.projectName +' account.');
                    }
                });
        },
        function(user, callback){
            
            if(user !== null ){
                // If there is a user, skip the invite chain and return.
                callback(null, user);
            }

            models.Invite
                .findOne({'invite_email' : address})
                .exec(function(err, i){
                    if(!i){ 
                        // if there is no Invite, pass to next step.
                        callback(null, null); 
                    }
                    else {
                        // if there is an invite, pass that to results.
                        callback(null, 'You have already sent that Invite.');
                    }
                });
        },
        function(args, callback){
            if(args !== null){
                // If either a user or an Invite exists on the system, pass it along.
                callback(null, args);
            }

            // Send an Invite in e-mail to whomever.
            // TODO: Promisify this bit.
            
            models.Invite.create({
                _account : inviter._account,
                created_by_user : inviter._id,
                invite_email : address
            }, function(err, invite){
                if(err){ console.error(err); }

                var mailer = new Emailer(
                    { to: { email: invite.invite_email, },
                      author: invite._account,
                      subject: "Invite from "+ ENV.projectName ,
                      template: "invite"
                    },
                    { Invite_by: inviter.name,
                      invite_link: ENV.projectURL +'/login/'+invite._id
                    });

                mailer.send(function(err, result) {
                    if (err) {}
                    callback(null, 'Invite sent to '+ invite.invite_email);
                });
            });
        }
    ], 
    function(err, results){
        if(err){ console.error(err); }
        next(null, results);
    });
};