// checkRole.js
// middleware to authenticate a user request on the DB
'use strict';

    /*

    if user has a role 
    and if scope is set, if user has the current scope in their scopes field
    and if user's scopes field contains the current request parameter id (optional)
    go to next otherwise unauthorized
    
    */

module.exports = function(role, scope) {
        return function(req, res, next) {
            // RULES:
            // if someone is a user, they can always edit their own account.
            // superAdmin can do what they like, and also have all roles.
            // Active Documents can be edited by their own admin
            
            // do we have a req.params?
            var q = {};

            if(req.params._id ) { q = {'_id' : req.params._id,'active' : true, '_admin' : { $in: [ req.user._id ] }}; }
            if(!req.params._id ){ q = {'active' : true, '_admin' : { $in: [ req.user._id ] }};  }
            if(role === "create_div"){console.log(req.body, req.params._id); q = { '_id' : req.params._id}   }

            req.findQuery = q;

            if(req.user){
                if((req.user._id === req.params._id) || (req.user.roles.indexOf(role) !== -1) ) { next(); }
                else { 
                    res.status(401).send('Unauthorized request.'); 
                }
            }
        }
    }

