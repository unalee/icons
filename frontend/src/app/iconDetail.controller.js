'use strict';

angular.module('icons')
  .controller('iconDetailCtrl', function ($scope, $state, $http) {

  	$scope.icons = [];
  	$scope.icon = {};
  	//$scope.loading = true;
    $http.get('/assets/json/icons.json').success(function(data) {
    	console.log(data)
    	$scope.icons = data;
    }).error(function() {
    	$rootScope.$broadcast('iconsDisplayMessage', {
    		type: "alert",
    		message: "Oops, something went wrong loading this icon. Please try again."
    	});
    });

  });
