'use strict';

angular.module('icons')
  .controller('iconsListCtrl', function ($scope, $rootScope, userService, $state, $http) {

  	$scope.icons = [];
  	$scope.icon = {};
  	//$scope.loading = true;

    $http({
      url: '/api/icon/all',
      method: 'GET',
      headers: userService.getAccessHeaders()
    }).success(function(icons) {
      $scope.icons = icons;
    }).error(function() {
    	$rootScope.$broadcast('iconsDisplayMessage', {
    		type: "alert",
    		message: "Oops, something went wrong loading this icon. Please try again."
    	});
    });


  });
