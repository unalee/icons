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
var should  = require('chai').should;
var expect  = require('chai').expect;
var request = require('supertest-as-promised');
var Promise = require('bluebird');

var mongoose = require('mongoose');
var models   = require('../server/models');
var fn 		   = require('../server/functions');

var app = require('../server.js');
var api = request(app);

// =============================================================
// ROOT FUNCTIONS
// =============================================================

before(function(done){
	models.User.remove({}, function(err, doc){});
	done();
});


// =============================================================
// START TESTS 
// =============================================================

describe("Registration Tests", function(){

	var agent = request.agent(app); // this is to check logins, not account creation.

	// Signup routes =====
	describe('/auth/signup', function () {
	    
	    it('should fail an empty request', function(done){
	        api.post('/auth/signup')
	        .send({ user: null, password: null })
	        .end(function(err, data) {
	            expect(data.body).to.deep.include({ error: 'Email and Password required' });
	            done();
	        });
	    });

	    it('should register a new user on the db', function(done){
	        // this.timeout(10000);
	        api.post('/auth/signup').send({
	            email    : 'becky@made.com', 
	            name     : 'becky',
	            password : 'becky',
	            roles    : ['admin']
	        }).then(function(data){
	            expect(data.body).to.have.property('token')
	            expect(data.body.token).to.not.be.null
	            done();
	        });
	    });


	    it('should not double-register a user that exists in the system', function(done){
	        // this.timeout(10000);
	        api.post('/auth/signup').send({
	            email: 'becky@made.com', 
	            name:'becky',
	            password:'becky',
	        }).then(function(data){
	            expect(data.body).to.equal('That user already exists.');
	            done();
	        });
	    });
	});

	//forgot-password routes =======
	describe('/auth/forgot', function(){
	    it('should set a new token on request by existing user', function(done){
	        api.post('/auth/forgot')
	            .send({
	            email: 'becky@made.com'
	        }).then(function(data){
	            expect(data.body.token).to.equal(1);
	            done();
	        });
	    });

	    it('should reset a password token if there is a token on that account', function(done){
	        api.post('/auth/forgot')
	            .send({
	            email: 'becky@made.com'
	        }).then(function(data){
	            expect(data.body.token).to.equal(1);
	            done();
	        });
	    });

	    it('should return a token for a login', function(done){
	        api.post('/auth/login')
	            .send({
	                email    : 'becky@made.com',
	                password : 'becky'
	            }).then(function(data){
	                expect(data.body).to.have.property('token');
	                expect(data.body.token).to.not.be.null;
	                done();
	            });
	    });
	    

	});

});

// User Tests ===================================

describe("User Tests", function(){
	var apiToken1 = '';
	var apiToken2 = '';

	var User1 = {};
	var User2 = {};

	 after(function(done){
    	api.post('/auth/signup').send({ email: 'norm@made.com', password:'norm', name:'norm' })
           .then(function(data){
        	expect(data.body.token).to.not.be.null;
        	done();
        });
    })

	before(function(done){
		api.post('/auth/signup').send({
                email: 'robin@made.com', 
                name:'robin',
                password:'robin'
            })
		.then(function(data){
			apiToken2 = data.body.token;
			expect(data.body).to.have.property('token')
            expect(data.body.token).to.not.be.null
		})
		.then(function(data){
			return api.post('/auth/login').send({ email:'becky@made.com', password: 'becky' })
		})
		.then(function(data){
			apiToken1 = data.body.token;

			api.get('/api/user')
	    	   .set('x-access-token', data.body.token)
	    	   .then(function(data){
	    	   		User1 = data.body[0];
	    	   		User2 = data.body[1];
	    	   		done();
	    	   })
		});
    })



	describe('/api/user', function(){
	    // TODO - additional tests ==========
	    it('should return all users on the db to an admin', function(done){
	    	api.get('/api/user')
	    		.set('x-access-token', apiToken1)
	    	   	.then(function(data){
	    	   		expect(data.body).to.be.an('array');
	    	   		expect(data.body[0]).to.include.keys('name','_id', 'email')
	    	   		expect(data.body[0]).to.not.include.keys('password')
	    	   		done();
	    	   	})
	    });

	    it.skip('should let users find each other by email', function(done){
	    	api.post('/api/user/')
	    		.set('x-access-token', apiToken2)
	    		.send({
	    			'find' : 'becky@made.com'
	    		})
	    		.expect(200)
	    		.then(function(data){
	    			expect(data.body).to.be.an(array)
	    			expect(data.body).to.deep.include({'email' : 'becky@made.com' })
	    			done();
	    		})
	    })

	    it('should not return all users to a basic user', function(done){
	    	api.get('/api/user')
	    	   .set('x-access-token', apiToken2)
	    	   .expect(401)
	    	   .then(function(data){
	    	   		// console.log(data);
	    	   		done();
	    	   	})
	    })


	    it('should let a basic user edit their own account', function(done){
	    	api.put('/api/user/'+User2._id)
	    		.set('x-access-token', apiToken2)
	    		.send({
	    			'name' : 'Monica',
	    			'email' : 'monica@made.com'
	    		})
	    		.expect(200)
	    	   	.then(function(data){
	    	   		expect(data.body.name).to.equal('Monica')
	    	   		expect(data.body.email).to.equal('monica@made.com')

	    	   		return api.put('/api/user/'+User2._id).set('x-access-token', apiToken2).send({'name'  : 'robin','email' : 'robin@made.com'})
				}).then(function(data){
    				expect(data.body.name).to.equal('robin')
   					expect(data.body.email).to.equal('robin@made.com')
   					done();
	    		})
	   	})

	    it('should let a basic user edit only their own account', function(done){
	    	// console.log('checking the ID are proper: User1', User1.name, 'User2: ',User2.name)
	    	api.put('/api/user/'+User1._id)
	    		.set('x-access-token', apiToken2)
	    		.send({
	    			'testdata' : User1.name,
	    			'name' : 'Monica',
	    			'email' : 'monica@made.com'
	    		})
	    		.expect(401)
	    	   	.then(function(data){
	    	   		done();
	    	   	})
	    })
	})
});