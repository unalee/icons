// resend-invite.js
// Resend an extant Invite
'use strict';

module.exports = function(inviteId, inviter, next){

// Module dependencies ==========================
    var async   = require('async');
    var Emailer = require('../models/mailer');
    var models  = require('../../models');

// Create an Invite ===================================
    models.Invite.findById(inviteId)
        .exec(function(err,invite){
            
            var envelope_options = {
                to: {
                    email: invite.invite_email,
                },
                author: inviter.name,
                subject: "Invite from APP_NAME",
                template: "invite"
            };

            var message_variables = {
                Invite_by: "APP_NAME",
                invite_link: 'PROJECT_URL'+invite._id
            };

            var mailer = new Emailer(envelope_options, message_variables);

            mailer.send(function(err, result) {
                if (err) {
                    return 
                }else{
                    // 
                    next(invite);
                }
            });
        });
};