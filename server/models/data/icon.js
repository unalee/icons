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
    type: Schema.Types.ObjectId,
    index: true
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
    trim: true,
    lowercase: true
  }],
  story: String,
  title: String,
  location: String,
});

Icon.pre('save', function(next) {
  console.log('Icon is saving!');
  var now = new Date();
  if (!this.created) {
    this.created = now;
  }
  next();
});

module.exports = db.model('Icon', Icon);
