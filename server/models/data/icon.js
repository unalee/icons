// icon.js
// the main unit of interaction in this DB
'use strict';

const mongoose = require('mongoose'),
  validate = require('mongoose-validator'),
  Schema = mongoose.Schema,
  connect = rootRequire('./config/db'),
  db = connect.db;

let urlValidator = [
  validate({
    validator: 'isURL',
    message: "Please supply a valid URL"
  })
]

let Icon = new Schema({
  created: Date,
  url: {
    type: String,
    trim: true,
    validate: urlValidator
  },
  admin: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  story: {
    type: String
  }
});

Icon.pre('save', function(next) {
  var now = new Date();
  if (!this.created) {
    this.created = now;
  }
  next();
});

module.exports = db.model('Icon', Icon);
