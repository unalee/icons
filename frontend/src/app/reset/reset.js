'use strict';

angular.module('icons')
  .controller('passwordResetCtrl', function ($scope, userService) {
    $scope.date = new Date();
    $scope.user = {};
    $scope.loggedIn = false; //#security

    

  });
