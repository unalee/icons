// organization.js
// container for squads, which can be composed into "teams" or other sorting methods
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connect = rootRequire('./config/db');
var db = connect.db;

var OrgSchema = new Schema ({
    created         : Date,
    updated         : Date,
    active          : { type: Boolean, default : true },
    
    _admin          : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    _ancestor       : { type: Schema.Types.ObjectId, ref: 'Org' },

    name            : { type: String, trim : true },
    slug            : { type: String, trim : true },
    type            : { type: String, trim : true , default: 'league'},
});

OrgSchema.pre('save', function(next){
    var now = new Date();
    this.updated = now;
    if ( !this.created ) {
        this.created = now;
    }
    next();
});

module.exports = db.model('Org', OrgSchema);