angular.module('icons')
	.controller('latestRemixCtrl', function($scope, $http) {

		$scope.icons = [];
		$http.get('/assets/json/icons.json').success(function(data) {
    	
    		for(var i = 0; i < data.length; i++) {
    			if(angular.isDefined(data[i].parent)) {
    				$scope.icon = data[i];
    				$scope.icon.id = i;
    			}
    		}

	    }).error(function() {
	    	$rootScope.$broadcast('iconsDisplayMessage', {
	    		type: "alert",
	    		message: "Oops, something went wrong loading icons."
	    	});
	    });


	}).directive('iconsLatestRemix', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/remix/latest-remix.html',
			controller: 'latestRemixCtrl'
		};
	});