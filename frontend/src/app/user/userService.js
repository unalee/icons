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
        loggedIn = false;
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
          console.warn('there was no token');
          resolve(false);
        } else {
          $http({
            method: 'POST',
            url: '/auth/token',
            headers: getAccessHeaders()
          }).then(function(res) {
            var valid = (res.data || {}).valid;
            resolve(valid);
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

    var getAccessHeaders = function() {
      return {
        'x-access-token': getCurrentSessionToken(),
      };
    };

    userAPI.getAccessHeaders = getAccessHeaders;

		return userAPI;
});
