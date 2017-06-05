'use strict';

angular.module('icons')
  .controller('iconsListCtrl', function ($scope, $rootScope, dataService, $state, $http) {

  	$scope.icons = [];
  	$scope.icon = {};
  	//$scope.loading = true;

    dataService.getAllIcons().then(function(res) {
      $scope.icons = res.data;
    },function(error) {
    	$rootScope.$broadcast('iconsDisplayMessage', {
    		type: "alert",
    		message: "Oops, something went wrong loading this icon. Please try again."
    	});
    });


  });
