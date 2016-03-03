// api.js - api routes

var express = require('express');
var router = express.Router();

var checkRole = require('../functions/helperFunctions/checkRole');
var models = require('../models'),
  User = models.User;

router.get('/user', checkRole('get_all_user'), function(req, res) {
  console.log('touched get all users');

  User.find().exec((err, next) => {
    if (err) { console.error(err); }
    res.json(next);
  });
});


router.put('/user/', checkRole('update_self'), function(req, res) {
  User.findById(req.user._doc._id).exec((err, user) => {
    if (err) { console.error(err); }
    if (!user ){ console.log('No user found.') }

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err, data) => {
      if (err) {
        console.error(err);
        res.json({error: err})
      }
      res.json(data);
    })
  });
});

module.exports = router;
