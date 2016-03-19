'use strict';

angular.module('icons')
  .controller('iconDetailCtrl', function ($scope, $rootScope, $state, $http) {

  	$scope.icons = [];
  	$scope.icon = {};
  	//$scope.loading = true;
    $http.get('/assets/json/icons.json').success(function(data) {
    	
    	$scope.icons = data;
    	if(angular.isDefined($state.params.iconId)) {
    		$scope.icon = $scope.icons[parseInt($state.params.iconId)];
    	}

    }).error(function() {
    	$rootScope.$broadcast('iconsDisplayMessage', {
    		type: "alert",
    		message: "Oops, something went wrong loading this icon. Please try again."
    	});
    });

  });
