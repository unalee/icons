var jwt = require('jsonwebtoken');
var config = require('../../../secrets');
var Promise = require('bluebird');

module.exports = (token) => {
  return new Promise((resolve, reject) => {
    if (token) {
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          resolve();
        } else {
          resolve(decoded._doc);
        }
      });
    } else {
      resolve();
    }
  });
}
