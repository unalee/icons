// squad.js
// stores sets of participants, belongs to given organization and assorted other sub-orgs
// a squad is based on a team model for sports
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connect = rootRequire('./config/db');
var db = connect.db;

/* NOTES ========================================

    - Waiting lists are managed separately from registration
    - this is to allow administrators to choose who is accepted from list A to list B

// ============================================== */

var SquadSchema = new Schema ({
    created_by_user : { type: Schema.Types.ObjectId, ref: 'User' },
    created         : Date,
    updated         : Date,
    active          : { type: Boolean, default : true },
    _ancestor       : { type: Schema.Types.ObjectId, ref: 'Org' },
    _admin          : [{ type: Schema.Types.ObjectId, ref: 'User' }],

    name            : { type: String, trim: true },
    sponsors        : [],
    photo           : { type: String, trim: true },
    regLimit        : Number,
    waitingList     : [{
        added : Date,
        participant : { type: Schema.Types.ObjectId, ref: 'Participant'}
    }],
    registered      : [{
        added : Date,
        participant : { type: Schema.Types.ObjectId, ref: 'Participant'}
    }]
});

SquadSchema.pre('save', function(next){
    var now = new Date();
    this.updated = now;
    if ( !this.created ) {
        this.created = now;
    }
    next();
});

module.exports = db.model('Squad', SquadSchema);