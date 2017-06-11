'use strict';

angular.module('icons')
  .controller('navbarCtrl', function ($scope, userService) {
    $scope.date = new Date();
    $scope.loggedIn = false; //#security

    $scope.logIn = function() {
    	userService.logIn($scope.user);
    }

    $scope.logOut = function() {
    	userService.logOut();
    };

    $scope.validUser = function() {
        //return true;
      return userService.isAuthenticated();
    };

  });
