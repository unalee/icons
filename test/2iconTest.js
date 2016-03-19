// registrationTest.js 
// Tests user registration routes
'use strict';

// Set global to work outside of node =========================
global.rootRequire = function(name) {
  name = name.substring(1, name.length);
  var dir = __dirname.substring(0, __dirname.length - 5);
  return require(dir + name);
};

// Module dependencies ==========================
const should = require('chai').should,
      expect = require('chai').expect,
      request = require('supertest-as-promised'),
      Promise = require('bluebird'),
      mongoose = require('mongoose'),
      models = require('../server/models'),

      app = require('../server.js'),
      api = request(app);


// todo this should be replaced with sinon stubbing
let tagName = "assured",
    tagNames = ["handbills", "Black Lives Matter"];


// =============================================================
// ROOT FUNCTIONS
// =============================================================

before(function(done) {
  models.Icon.remove({}, function(err, doc) {});
  done();
});


// log a user in so that we can get icons via token auth
before(function(done) {
  api.post('/auth/login')
    .send({
      email: 'becky@made.com',
      password: 'becky'
    })
    .then(function(data) {
      apiToken1 = data.body.token;
      api.get('/api/user')
        .set('x-access-token', data.body.token)
        .then(function(data) {
          User1 = data.body[0];
          done();
        })
    });
});


// =============================================================
// START TESTS
// =============================================================

describe("Icon Interaction Tests", function() {

  var agent = request.agent(app); // this is to check logins, not account creation.

  // Signup routes =====
  describe('/api/icon', function() {
    let path = 'api/icon'

    it('should fail an untokened request', function(done) {
      api.get(path)
        .end(function(err, data) {
          // in here we should expect the same shape of reply as a success, but no data
          done();
        });
    })

    it('should fail a malformed token request', function(done) {
      api.get(path)
        .set('x-access-token', 'abvy8abcinasocniaca8912inac')
        .end(function(err, data) {
          // in here we should expect an array of images with one entry
          done();
        });
    })

    it('should post an icon with the tokenized username', function(done) {
      api.post(path)
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect an array of images with one entry
          done();
        });
    })

    it('should return all icons to any user', function(done) {
      api.get(path)
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect an array of images
          done();
        });
    })

    it('should return a specific icon by id', function(done) {
      api.get(path + '/2')
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect a single image
          done();
        });
    })
  })

  describe('/api/tags', function() {
    let path = 'api/tags/'
    it('should fail an untokened request', function(done) {
      api.get(path)
        .end(function(err, data) {
          // in here we should expect the same shape of reply as a success, but no data
          done();
        });
    })

    it('should fail a malformed token request', function(done) {
      api.get(path)
        .set('x-access-token', 'abvy8abcinasocniaca8912inac')
        .end(function(err, data) {
          // in here we should expect an array of images with one entry
          done();
        });
    })

    it('should return all tags', function(done) {
      api.get(path)
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect an array of images
          done();
        });
    })

    it('should return all icons by tag', function(done) {
      api.get(path + '/' + tagName)
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect an array of images
          done();
        });
    })

  })
});
