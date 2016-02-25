// participant.js
// stores individual units for squad composition
'use strict';

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;

var connect = rootRequire('./config/db');
var db = connect.db;

//  a Participant is the common account model, storing information such as:
//  Events - when they played and where and which squad won?
//  Photo, birthday, phone number/email, etc.

// A USER is an account number which may be pluralized. Participants belong to Users.
// USERS are used for billing and management of accounts, logins, etc.
// PARTICIPANTS are used to manage roles on teams, such as player or coach. 
// Participants are pluralized because a single participant object governs
// Children who play on teams
// Adults who play on teams
// Adults who run teams
// Children who are involved in administration
// So should participants be able to log in directly based on whether or not they're marked as Adults?

var emailValidator = [
    validate({
        validator: 'isEmail',
        message  : "Please enter a valid e-mail address"
    })
]

var ParticipantSchema = new Schema ({
    
    created    : Date,
    updated    : Date,
    created_by : { type: Schema.Types.ObjectId},
    active     : { type: Boolean, default : true },
    _admin     : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    _squads    : [{ type: Schema.Types.ObjectId, ref: 'Squad' }],
    
    name     : { type: String, trim: true },
    birthday : { type: Date, default: ''},
    photo    : { type: String, trim: true },
    email    : { type: String, trim: true, validate: emailValidator },
    phone    : { type: String, trim: true },
    desc     : { type: String, trim: true },
    role     : { type: String, trim: true },
    medContacts : [{
        name  : { type: String, trim: true },
        phone : { type: String, trim: true },
        email : { type: String, trim: true, validate: emailValidator },
    }]
});

ParticipantSchema.pre('save', function(next){
    var now = new Date();
    this.updated = now;
    if ( !this.created ) {
        this.created = now;
    }
    next();
});

module.exports = db.model('Participant', ParticipantSchema);