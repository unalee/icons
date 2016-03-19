// reset-lost-password
// resets a lost user password via token
'use strict';


module.exports = function(token, pass, app, next){
// Module dependencies ==========================
    // var async      = require('async');
    var bcrypt     = require('bcrypt');
    var nodemailer = require('nodemailer');
    var Bluebird   = require('bluebird');
    var models     = Bluebird.promisifyAll(require('../../models'));

// load functions ===============================
    function generateHash(password) { return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); }

// RESET A LOST PASSWORD ==================================

    var resetPasswordMail = function(user){
        var smtpTransport = nodemailer.createTransport({
                        service: 'Mandrill',
                        auth: {
                            user: '', // ADD USER HERE
                            pass: app.locals.mandrillSecret // add to secrets.js
                        },
                        host: "smtp.mandrillapp.com",
                        port: 587
                    });

        var mailOptions = {
            to: user.email,
            from: '', // SUPPORT E-MAIL
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };

        smtpTransport.sendMail(mailOptions, function(err) {
            next(null, 'The password for your account '+ user.email +' has been changed.')
        });
    }

    
    models.User.findOneAsync({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
        .then(function(user){
            if (user === null ){ 
                console.log('no user found'); 
                return next(null, 0);
            }
            // TODO: Abstract this onto the user model
            user.password = generateHash(pass);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err, usr){
                console.log('saved user', usr);
                if(usr === 0){ return next(null, usr); }

                resetPasswordMail(usr);
            });
        })
    .catch(function(err){
        if(err){console.error(err)}
    })
};