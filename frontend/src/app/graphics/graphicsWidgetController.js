angular.module('icons')
	.controller('graphicsWidgetController', function($scope) {
		console.log('graphicsWidgetController loaded');

		// $scope.graphics = [];

		// for(var i=1; i <= 12; i++) {
		// 	$scope.graphics.push({
		// 		src: 'placeholder://',
		// 		title: 'Placeholder image',
		// 		location: 'path/to/graphic'
		// 	});
		// }

		$scope.gotoGraphic = function(location) {
			console.log('let\'s see ', location);
		};

		$scope.graphics = [
			{
				src: 'assets/images/Exchange.jpg',
				title: 'title goes here',
				location: 'i/dont/know/what/that/is'
			},
			{
				src: 'assets/images/Convergence.jpg',
				title: 'title goes here',
				location: 'i/dont/know/what/that/is'
			},
			{
				src: 'assets/images/Harmony.jpg',
				title: 'title goes here',
				location: 'i/dont/know/what/that/is'
			},
			{
				src: 'assets/images/CollectiveCare1.jpg',
				title: 'title goes here',
				location: 'i/dont/know/what/that/is'
			}
			// {
			// 	src: 'assets/images/img.jpg',
			// 	title: 'title goes here',
			// 	location: 'i/dont/know/what/that/is'
			// },
			// {
			// 	src: 'assets/images/img.jpg',
			// 	title: 'title goes here',
			// 	location: 'i/dont/know/what/that/is'
			// }
		]

	}).directive('iconsGraphicsWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/graphics/graphics-widget.html',
			controller: 'graphicsWidgetController'
		};
	});