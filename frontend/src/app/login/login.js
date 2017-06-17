'use strict';

angular.module('icons')
  .controller('loginCtrl', function ($scope, userService, $rootScope) {
    $scope.date = new Date();
    $scope.user = {};

    $scope.logIn = function() {
      userService.logIn($scope.user);
    };

    $scope.logOut = function() {
      debugger;
      userService.logOut();
    };

    $scope.validUser = function() {
      return userService.isAuthenticated();
    };

  });
