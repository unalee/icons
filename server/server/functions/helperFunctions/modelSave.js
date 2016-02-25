// modelSave.js - A promise to save a Mongoose model
'use strict';

module.exports = function(mongooseModel){
    var Promise = require('bluebird');
    return new Promise(function (resolve, reject) {
        mongooseModel.save(function(err,done) {
          if (!done || done.error || err) {
            console.error(err);
            return reject(done.error);}
          return resolve(done);
        })
    })
}