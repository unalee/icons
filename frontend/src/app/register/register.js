'use strict';

angular.module('icons')
  .controller('registerCtrl', function ($scope, userService) {
    $scope.date = new Date();
    $scope.user = {};
    $scope.loggedIn = false; //#security

    

  });
