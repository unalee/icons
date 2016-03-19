angular.module('icons')
	.controller('graphicsWidgetController', function($scope, $http) {
		console.log('graphicsWidgetController loaded');

		$scope.icons = [];
		$http.get('/assets/json/icons.json').success(function(data) {
    	
    		for(var i = 0; i < 4; i++) {
    			$scope.icons.push(data[i]);
    		}

	    }).error(function() {
	    	$rootScope.$broadcast('iconsDisplayMessage', {
	    		type: "alert",
	    		message: "Oops, something went wrong loading icons."
	    	});
	    });


	}).directive('iconsGraphicsWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/graphics/graphics-widget.html',
			controller: 'graphicsWidgetController'
		};
	});