// xtest.js
// clear all remaining test mocks from the database if we're using a database

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
var should = require('chai').should;
var expect = require('chai').expect;
var request = require('supertest-as-promised');

var mongoose = require('mongoose');
var models = require('../server/models');
var fn = require('../server/functions');

var app = require('../server.js');
var api = request(app);
// var environment = require('../config/environment-test');

// field_guide_users_test

// =============================================================
// ROOT FUNCTIONS
// =============================================================

var account = mongoose.Types.ObjectId();

before(function(done){
	var agent = request.agent(app);
	done();
});

after(function(done){
	done();
});