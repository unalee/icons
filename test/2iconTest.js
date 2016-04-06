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

      Icon = models.Icon,
      app = require('../server.js');


// todo this should be replaced with sinon stubbing
let tagName = "assured",
    tagNames = ["handbills", "Black Lives Matter"],
    api = request(app),
    apiToken1;


// =============================================================
// ROOT FUNCTIONS
// =============================================================

before(function(done) {
  Icon.remove({}, function(err, doc) {});
  done();
});

// =============================================================
// START TESTS
// =============================================================

describe("Icon Interaction Tests", function() {
  before(function(done) {
    api.post('/auth/login')
      .send({
        email: 'becky@made.com',
        password: 'becky'
      })
      .then(function(data) {
        apiToken1 = data.body.token;
        done();
      });
  })


  // Signup routes =====
  describe('/api/icon', function() {
    let path = 'api/icon'

    it('should fail an untokened request', function(done) {
      api.get(path)
        .end(function(err, data) {
          // in here we should expect the same shape of reply as a success, but no data
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('1');
          done();
        });
    })

    it('should fail a malformed token request', function(done) {
      api.get(path)
        .set('x-access-token', 'abvy8abcinasocniaca8912inac')
        .end(function(err, data) {
          // in here we should expect an array of images with one entry
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('1');
          done();
        });
    })

    it('should post an icon with the tokenized username', function(done) {
      api.post(path)
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect an array of images with one entry
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('1');
          done();
        });
    })

    it('should return all icons to any user', function(done) {
      api.get(path)
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect an array of images
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('14');
          done();
        });
    })

    it('should return a specific icon by id', function(done) {
      api.get(path + '/2')
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect a single image
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('1');
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
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('1');
          done();
        });
    })

    it('should fail a malformed token request', function(done) {
      api.get(path)
        .set('x-access-token', 'abvy8abcinasocniaca8912inac')
        .end(function(err, data) {
          // in here we should expect an array of images with one entry
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('1');
          done();
        });
    })

    it('should return all tags', function(done) {
      api.get(path)
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect an array of tags
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('14');
          done();
        });
    })

    it('should return all icons by tag', function(done) {
      api.get(path + '/' + tagName)
        .set('x-access-token', apiToken1)
        .end(function(err, data) {
          // in here we should expect an array of images
          expect(data.body).to.be.an('array');
          expect(data.body).to.have.length('14');
          done();
        });
    })

  })
});
