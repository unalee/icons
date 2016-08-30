// checkRole.js
// middleware to authenticate a user request on the DB
'use strict';

module.exports = function(role) {
  return function(req, res, next) {
    const user = req.user;
    if (!user) {
      console.log('User not logged in');
      res.status(401).send('Please log in.');
    }
    if (user.roles.indexOf(role) == -1) {
      console.log('Unauthorized request');
      res.status(401).send('Unauthorized request.');
    } else {
      console.log('Valid request');
      next();
    }
  }
}
