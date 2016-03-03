// jwtAuth.js
'use strict';

var models = require('../../models');
var jwt = require('jwt-simple');
 
module.exports = function(app, req, res, next) {
  // code goes here
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

  if (token) {
  try {
    var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
 
        // handle token here
        if (decoded.exp <= Date.now()) {
            res.end('Access token has expired', 400);
        }
        
        // TODO: put selection fields in here so we can't pass passwords by mistake?
        models.User.findOne({ _id: decoded.iss }).exec(function(err, user) {
            req.user = user;
        });
     
      } catch (err) {
        return next();
      }
    } else {
      next();
    }

};