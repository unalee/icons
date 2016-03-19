'use strict';

angular.module('icons')
	.service('userService', function($http, $rootScope, $state, localStorageService) {

		var userAPI = {};
		var config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		var getCurrentSessionToken = function() {
			return localStorageService.get("userToken");
		};

		var currentUser = getCurrentSessionToken();

		userAPI.logIn = function(creds) {
			$http.post('/auth/login', creds, config).success(function(res, status, headers, config) {
				console.log(res);
				if(angular.isDefined(res.data.token)) {
					console.log("user logged in successfully");
					localStorageService.set("userToken", res.data.token);
					$state.go('upload');
				} else {
					$rootScope.$broadcast('iconsDisplayMessage', {
						type: "alert",
						message: "Incorrect email or password. Please try again."
					});
				}
			}).error(function(data, status, headers, config) {
				$rootScope.$broadcast('iconsDisplayMessage', {
					type: "alert",
					message: "Oops, something went wrong. Please try again."
				});
			});
		};

		userAPI.logOut = function() {
			$http.post('/auth/logout', {}, config).success(function(res){
				localStorageService.remove("userToken");
			}).error(function(data, status, headers, config) {
				$rootScope.$broadcast('iconsDisplayMessage', {
					type: "alert",
					message: "Oops, something went wrong. Please try again."
				});
			});
		};

		userAPI.isAuthenticated = function() {
			return getCurrentSessionToken() !== null;
		};

		userAPI.register = function(newUser) {
			 
			$http.post('/auth/signup', newUser, config).success(function(res) {
				console.log(res);
				if(angular.isDefined(res.data.token)) {
					localStorageService.set("userToken", res.data.token);
					$state.go('upload');
					$rootScope.$broadcast('iconsDisplayMessage', {
						type: "success",
						message: "Account created successfully."
					});
				} else {
					$rootScope.$broadcast('iconsDisplayMessage', {
						type: "alert",
						message: "Oops. An error occured."
					});
				}
			}).error(function(data, status, headers, config) {
				$rootScope.$broadcast('iconsDisplayMessage', {
					type: "alert",
					message: "Oops, something went wrong. Please try again."
				});
			});
		}

		return userAPI;
});