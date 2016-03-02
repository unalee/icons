// checkRole.js
// middleware to authenticate a user request on the DB
'use strict';

module.exports = function(role) {
  return function(req, res, next) {
    const user = req.user._doc;
    if (!user) {
      res.status(401).send('Please log in.');
    }
    if (user.roles.indexOf(role) == -1) {
      res.status(401).send('Unauthorized request.');
    } else {
      next();
    }
  }
}
