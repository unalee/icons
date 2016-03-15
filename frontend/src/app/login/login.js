'use strict';

angular.module('icons')
  .controller('loginCtrl', function ($scope, userService) {
    $scope.date = new Date();
    $scope.user = {};
    $scope.loggedIn = false; //#security

    $scope.logIn = function() {
        console.log($scope.user);
    	userService.logIn($scope.user).then(function(user) {

        });
    };

    $scope.logOut = function() {
    	userService.logOut();
    };

    $scope.validUser = function() {
        return userService.isAuthenticated();
    };

  });