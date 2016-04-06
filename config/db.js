// db.js
'use strict';

const mongoose = require('mongoose'),
  uriUtil = require('mongodb-uri'),
  // var mongoUrl = 'mongodb://archive_admin:basca81240yh1ec@ds013738.mlab.com:13738/vision_archive';
  mongoUrl = 'mongodb://127.0.0.1/vision_archive',
  mongooseUri = uriUtil.formatMongoose(mongoUrl),
  options = {
    server: {
      socketOptions: {
        keepAlive: 1,
        connectTimeoutMS: 30000
      }
    },
    replset: {
      socketOptions: {
        keepAlive: 1,
        connectTimeoutMS: 30000
      }
    }
  };
mongoose.connect(mongoUrl, options);

let db = mongoose.connection;

console.log('opening db...');
db.on('error', function(err) {
  console.log("local error opening the db: " + err.message);
});
db.once('open', function callback() {
  // console.log(mongoUrl); // useful for checking where we're hooked to
  console.log('db open');
});

module.exports = {
  db: db
};
