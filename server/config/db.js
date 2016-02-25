// db.js
'use strict';

var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');

// var mongoUrl = 'mongodb://archiveAccess:FICO*V*^Soansc98sachbapisx*^GASC.mongolab.com:13738/vision_archive';
var mongoUrl = 'mongodb://127.0.0.1/vision_archive'

var mongooseUri = uriUtil.formatMongoose(mongoUrl);

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

mongoose.connect(mongoUrl, options);
var db = mongoose.connection;

console.log('opening db...');
db.on('error', function(err) { console.log("local error opening the db: " + err.message); });
db.once('open', function callback () {
	// console.log(mongoUrl); // useful for checking where we're hooked to
    console.log('db open');
});

module.exports = { db: db };