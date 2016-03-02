// server/models/auth/user.js
// controls user accounts
'use strict';

var mongoose = require('mongoose'),
  validate = require('mongoose-validator'),
  uniqueValidator = require('mongoose-unique-validator'),
  bcrypt = require('bcrypt'),
  connect = global.rootRequire('./config/db').db,
  promisify = require('bluebird').promisify,
  Schema = mongoose.Schema;

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: "Please enter a valid e-mail address"
  })
]

var user = 'create_user get_user update_user delete_user'.split(' '),
  icons = 'create_icon get_icon update_icon delete_icon'.split(' '),
  admin_roles = 'get_all_user'.split(' '),
  admin = user.concat(icons).concat(admin_roles),
  basic = user.concat(icons),
  roles = user.concat(icons).concat(admin_roles);

var userSchema = new Schema({
  _invite: {
    type: Schema.Types.ObjectId,
    ref: 'Invite'
  },
  _admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  created: Date,
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    validate: emailValidator,
    index: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    select: false
  },
  roles: [{
    type: String
  }],

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema),
  rounds = 10;


// generating a hash
userSchema.statics.genHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, rounds, function(err, hash) {
    if (err) { return next('password' + err); }
    user.password = hash;
    next();
  });
})

userSchema.pre('save', function(next) {
  var now = new Date();
  if (!this.created) {
    this.created = now;
  }
  next();
});

// create the model for users and expose it to our app
module.exports = connect.model('User');
