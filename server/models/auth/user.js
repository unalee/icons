// server/models/auth/user.js
// controls user accounts
'use strict';

var mongoose = require('mongoose'),
  validator = require('node-mongoose-validator'),
  bcrypt = require('bcrypt'),
  connect = global.rootRequire('./config/db').db,
  promisify = require('bluebird').promisify,
  Schema = mongoose.Schema;

var self = 'create_self get_self update_self delete_self'.split(' '),
  user = 'create_user get_user update_user delete_user'.split(' '),
  icons = 'create_icon get_icon update_icon delete_icon'.split(' '),
  admin_roles = 'get_all_user'.split(' '),
  admin = self.concat(user).concat(icons).concat(admin_roles),
  basic = self.concat(icons),
  roles = self.concat(user).concat(icons).concat(admin_roles);

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

const rounds = 10;

// generating a hash
userSchema.statics.genHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.comparePassword = function(password, done) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.statics.comparePassword = function(password, done) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function(next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, rounds, function(err, hash) {
    if (err) {
      return next('password' + err);
    }
    user.password = hash;
    next();
  });
})

userSchema.pre('save', function(next) {
  if (!this.roles || this.roles.length === 0) {
    this.roles = [];
    this.roles = basic;
  }

  if (this.roles.indexOf('admin') !== -1) {
    this.roles = [];
    this.roles = admin;
  }

  // if( this.roles.indexOf('superadmin') !== -1 ){
  //     this.roles.splice(this.roles.indexOf('superadmin'), 1);
  //     this.roles = superadmin;
  // }

  if (!this._admin || this._admin.length === 0) {
    this._admin = [this._id];
  }

  next();
});


userSchema.pre('save', function(next) {
  var now = new Date();
  if (!this.created) {
    this.created = now;
  }
  next();
});

// create the model for users and expose it to our app
module.exports = connect.model('User', userSchema);
