'use strict';

angular.module('icons')
  .controller('NavbarCtrl', function ($scope, userService) {
    $scope.date = new Date();
    $scope.loggedIn = false; //#security

    $scope.logIn = function() {
    	userService.logIn($scope.user).then(function(user) {

        });
    }

    $scope.logOut = function() {
    	userService.logOut();
    };

    $scope.validUser = function() {
        return userService.isAuthenticated();
    };

  });
