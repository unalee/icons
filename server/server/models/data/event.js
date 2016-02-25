// event.js
// how we model the meeting of squads
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connect = rootRequire('./config/db');
var db = connect.db;

//  a Participant is the common account model, storing information such as:
//  Events - when they played and where and which squad won?
//  Photo, birthday, phone number/email, etc.

var EventSchema = new Schema ({
    created  : Date,
    _squads  : [{ type: Schema.Types.ObjectId, ref: 'Squad' }],
    active   : { type: Boolean, default : true },

    date     : { type: Date, default: Date.now },
    location : { type: String, trim: true },
    desc     : { type: String, trim: true },
    
    volunteer_roles : [{
            part : { type: Schema.Types.ObjectId, ref: 'Participant' },
            name : { type: String, trim: true },
            desc : { type: String, trim: true }
        }],


});

EventSchema.pre('save', function(next){
    var now = new Date();
    if ( !this.created ) {
        this.created = now;
    }
    next();
});

module.exports = db.model('Event', EventSchema);