// medicalContact.js
// a model to store common medical contacts

'use strict';

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;

var connect = rootRequire('./config/db');
var db = connect.db;

var emailValidator = [
    validate({
        validator: 'isEmail',
        message  : "Please enter a valid e-mail address"
    })
]

var MedContactSchema = new Schema ({
    created_by_user : { type: Schema.Types.ObjectId },
    created         : Date,
    _participants   : [{ type: Schema.Types.ObjectId, ref: 'Participant' }],
    phone			: { type: String },
    email           : { type: String, trim : true, validate: emailValidator },
    type            : { type: String, trim : true }
});

MedContactSchema.pre('save', function(next){
    var now = new Date();
    if ( !this.created ) {
        this.created = now;
    }
    next();
});

module.exports = db.model('medContact', MedContactSchema);