// Registration.js
// this stores objects we use to register a user for a given event over a given window

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connect = rootRequire('./config/db');
var db = connect.db;

var RegSchema = new Schema ({
    created_by_user : { type: Schema.Types.ObjectId },
    created 		: Date
});

RegSchema.pre('save', function(next){
    var now = new Date();
    if ( !this.created ) {
        this.created = now;
    }
    next();
});

module.exports = db.model('Org', OrgSchema);