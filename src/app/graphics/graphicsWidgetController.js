angular.module('icons')
	.controller('graphicsWidgetController', function($scope) {
		console.log('graphicsWidgetController loaded');

		$scope.graphics = [];

		for(var i=1; i <= 12; i++) {
			$scope.graphics.push({
				src: 'placeholder://',
				title: 'Placeholder image',
				location: 'path/to/graphic'
			});
		}

		$scope.gotoGraphic = function(location) {
			console.log('let\'s see ', location);
		};

	}).directive('iconsGraphicsWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/graphics/graphics-widget.html',
			controller: 'graphicsWidgetController'
		};
	});