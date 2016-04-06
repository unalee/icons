// 0resetTest.js
// 'use strict';

// // Set global to work outside of node =========================
// global.rootRequire = function(name) {
//             name = name.substring(1, name.length);
//             var dir = __dirname.substring(0, __dirname.length - 5);
//             return require(dir + name);
//         };
        
// // Module dependencies ==========================
// var should  = require('chai').should;
// var expect  = require('chai').expect;
// var request = require('supertest-as-promised');
// var Promise = require('bluebird');

// var mongoose = require('mongoose');
// var models   = Promise.promisifyAll(require('../server/models'));
// var fn       = require('../server/functions');

// var app = require('../server.js');
// var api = request(app);

// before(function(done){

//     Promise.all([
//         models.Participant.removeAsync({}, function(err, doc){}),
//         models.User.removeAsync({}, function(err, doc){}),
//         models.Org.removeAsync({}, function(err, doc){}),
//         models.Squad.removeAsync({}, function(err, doc){})
//     ]).then(function(){
//         done();    
//     })
    
// });