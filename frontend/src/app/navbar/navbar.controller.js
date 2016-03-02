'use strict';

angular.module('icons')
  .controller('NavbarCtrl', function ($scope) {
    $scope.date = new Date();
    $scope.loggedIn = false; //#security

    $scope.validUser = function() {
    	return $scope.loggedIn;
    };

    $scope.login = function() {
    	$scope.loggedIn = true;
    }

    $scope.logout = function() {
    	$scope.loggedIn = false;
    };

  });
