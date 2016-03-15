'use strict';

angular.module('icons')
	.service('userService', function($http, localStorageService) {

		var userAPI = {};

		var getCurrentSession = function() {
			return localStorageService.get("user");
		};

		var currentUser = getCurrentSession();

		userAPI.logIn = function(creds) {
			console.log('Loggin in with', creds);
			return new Promise(function() { return currentUser; } )
		};

		userAPI.logOut = function() {

		};

		userAPI.isAuthenticated = function() {
			return true;
			return getCurrentSession() !== null;
		};

		return userAPI;
});