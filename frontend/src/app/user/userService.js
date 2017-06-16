'use strict';

angular.module('icons')
	.service('userService', function($http, $rootScope, $state, localStorageService) {

		var userAPI = {};
		var config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

    var loggedIn = false;

		var getCurrentSessionToken = function() {
			return localStorageService.get("userToken");
		};

		userAPI.logIn = function(creds) {
			$http.post('/auth/login', creds, config).success(function(res, status, headers, config) {
				if(angular.isDefined(res.token)) {
					localStorageService.set("userToken", res.token);
          loggedIn = true;
					$state.go('upload');
				} else {
					$rootScope.$broadcast('iconsDisplayMessage', {
						type: "alert",
						message: "Incorrect email or password. Please try again."
					});
				}
			}).error(function(data, status, headers, config) {
				console.error(data, status, headers)
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

    userAPI.getCurrentSessionToken = getCurrentSessionToken;

		userAPI.isAuthenticated = function() {
      return loggedIn;
		};

    userAPI.checkCurrentToken = function() {
      return new Promise(function(resolve, reject) {
        var token = getCurrentSessionToken();
        if (token === null) {
          resolve(false);
        } else {
          var headers = {
            'Content-Type': 'application/json',
            'x-access-token': token
          };
          $http.post('/auth/token', {}, headers).then(function(res) {
            resolve(true);
          }, function(error) {
            resolve(false);
          })
        }
      });
    };

    userAPI.setTokenValid = function(isValid) {
      if (isValid) {
        loggedIn = true;
      } else {
        localStorageService.remove("userToken");
        loggedIn = false;
      }
    };

		userAPI.register = function(newUser) {

			$http.post('/auth/signup', newUser, config).success(function(res) {
				console.log(res);
				if(angular.isDefined(res.token)) {
					localStorageService.set("userToken", res.token);
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

    userAPI.getAccessHeaders = function() {
      return {
        'x-access-token': getCurrentSessionToken(),
      };
    }

		return userAPI;
});
