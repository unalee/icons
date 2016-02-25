// user-create.js
// create a new user on the system
'use strict';

module.exports = function(user, next){
// Module dependencies ==========================
    var async    = require('async');
	var bcrypt   = require('bcrypt');
    var mongoose = require('mongoose');
    
    var models   = require('../../models');
    var fn       = require('../../functions');

// CREATE A NEW USER ============================

    // check if a user by that e-mail already exists
    // if not, create that user

    // TODO: check for invitations, convert to promises
    // console.log('create this user', user);

    async.waterfall([
        function(callback){
          models.User.findOne({ 'email' : user.email })
            .exec(function(err, doc) {
                if (err) { console.log(err); }
                var call = (doc !== null ) ? 'That user already exists.' : null ;
                callback(null, call);
            });
        },
        function(arg, callback){
            if(arg !== null ){ callback(null, arg); }
            else {
                user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
                
                var newUser = new models.User();
                fn.updateDoc(newUser, models.User, user)
                
                fn.modelSave(newUser).then(function(data){
                    next(null, data);
                }).catch(function(err){
                    if(err){ console.error(err); }
                })
            }
    }], next);	
};
