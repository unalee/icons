var jwt = require('jsonwebtoken');
var config = require('../../../secrets');

module.exports = function(req, res, next) {
  // decode token
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers[
    'x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    // console.log('Token set');
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        // console.log('Token invalid: ', err);
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save user to req.user for use in other routes.
        // console.log('Valid token');
        req.user = decoded._doc;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    // console.log('Untokened request');
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}
