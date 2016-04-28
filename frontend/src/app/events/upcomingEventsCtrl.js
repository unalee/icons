angular.module('icons')
	.controller('upcomingEventsCtrl', function($scope, $http) {

		$scope.events = [];
		$http.get('/assets/json/events.json').success(function(data) {
    	
    		for(var i = 0; i < $scope.limit; i++) {
    			$scope.events.push(data[i]);
    		}

	    }).error(function() {
	    	$rootScope.$broadcast('iconsDisplayMessage', {
	    		type: "alert",
	    		message: "Oops, something went wrong loading icons."
	    	});
	    });


	}).directive('iconsUpcomingEvents', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				limit: '@'
			},
			templateUrl: 'app/events/upcoming-events.html',
			controller: 'upcomingEventsCtrl'
		};
	});