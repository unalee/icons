// icon.js
// the main unit of interaction in this DB
'use strict';

const mongoose = require('mongoose'),
  validate = require('mongoose-validator'),
  uniqid = require('uniqid'),
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
  icon_id: {
    type: String,
    trim: true,
  },
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
  },
  title: {
    type: String
  }
});

Icon.pre('save', function(next) {
  var now = new Date();
  if (!this.created) {
    this.created = now;
  }
  if (!this.icon_id) {
    this.icon_id = uniqid();
  }
  next();
});

module.exports = db.model('Icon', Icon);
