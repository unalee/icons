angular.module('icons')
	.controller('latestImagesCtrl', function($scope, $http) {
		console.log('graphicsWidgetController loaded');

		$scope.icons = [];
		$http.get('/assets/json/icons.json').success(function(data) {
    	
    		for(var i = 0; i < $scope.limit; i++) {
    			$scope.icons.push(data[i]);
    		}

	    }).error(function() {
	    	$rootScope.$broadcast('iconsDisplayMessage', {
	    		type: "alert",
	    		message: "Oops, something went wrong loading icons."
	    	});
	    });


	}).directive('iconsLatestImagesWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				limit: '@'
			},
			templateUrl: 'app/images/latest-images-widget.html',
			controller: 'latestImagesCtrl'
		};
	});