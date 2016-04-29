angular.module('icons')
	.controller('latestEventCtrl', function($scope, $http) {

		$scope.event = {
			image: 'Latest-Event.jpg',
			link: 'hahaha'
		};

	}).directive('iconsLatestEvent', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/events/latest-event.html',
			controller: 'latestEventCtrl'
		};
	});