// server/models/auth/user.js
// controls user accounts
'use strict';

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var connect = global.rootRequire('./config/db');

connect = connect.db;

var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
 
// Users are the people who log in to our system to use it.
// They live on a separate DB from data.
// This DB is also where we store Invites.


var emailValidator = [
    validate({
        validator: 'isEmail',
        message  : "Please enter a valid e-mail address"
    })
]

var user  = 'create_user get_user update_user delete_user'.split(' ');
var icons = 'create_icon get_icon update_icon delete_icon'.split(' ');
var admin_roles = 'get_all_user'.split(' '); 

var admin = user.concat(icons).concat(admin_roles);
var basic = user.concat(icons);

var roles = user.concat(icons).concat(admin_roles);

var userSchema = new Schema({
  _invite  : { type: Schema.Types.ObjectId, ref: 'Invite' },
  _admin   : { type: Schema.Types.ObjectId, ref: 'User' },

  created  : Date,
  name     : { type:String, trim:true },
  email    : { type: String, trim: true, validate: emailValidator, required: true },
  password : { type: String, select: false },
  roles    : [{ type: String }],

  resetPasswordToken   : String,
  resetPasswordExpires : Date,

  google           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  }
});

// generating a hash
userSchema.methods.genHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.path('email')

userSchema.pre('save', (next) => {
  this.password = this.genHash(this.password);
  next();
})

userSchema.pre('save', (next) => {
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

  var now = new Date();
  if (!this.created) {
    this.created = now;
  }

  next();
});

// create the model for users and expose it to our app
module.exports = connect.model('User', userSchema);