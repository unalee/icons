// server/models/data/Invite.js
'use strict';

// Lives in the auth database, called field_guide_users
// ID of Invite and _account get passed with the Invite
// When a user clicks on an invite link, and goes to register, if they are already registered,
// Pending is set to false and we offer a password reset link

// Invites are how we get new users into the system.

var mongoose = require('mongoose');
var connect = rootRequire('./config/db');
connect = connect.db;

var Schema = mongoose.Schema;

var inviteSchema = new Schema({
    _account : { type: Schema.Types.ObjectId },
    invite_email: { type: String, trim: true },
    created : { type : Date },
    created_by_user : { type: Schema.Types.ObjectId, ref: 'User' },
    pending : {type: Boolean, default: true}
});

inviteSchema.pre('save', function(next){
    // set up the date
    var now = new Date();
    if ( !this.created ) {
        this.created = now;
    }
    next();
});

module.exports = connect.model('Invite', inviteSchema);