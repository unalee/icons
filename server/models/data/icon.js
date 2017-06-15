// icon.js
// the main unit of interaction in this DB
'use strict';

const mongoose = require('mongoose'),
  validator = require('node-mongoose-validator'),
  uniqid = require('uniqid'),
  Schema = mongoose.Schema,
  connect = rootRequire('./config/db'),
  db = connect.db;

let Icon = new Schema({
  created: Date,
  icon_id: {
    type: Schema.Types.ObjectId,
    index: true
  },
  url: {
    type: String,
    trim: true,
  },
  admin: [{
    type: String,
    trim: true
  }],
  parent: {
    type: String,
    trim: true
  },
  authors: [{
    type: Schema.Types.Mixed
  }],
  isOwnIcon: Boolean,
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
