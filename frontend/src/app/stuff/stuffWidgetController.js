angular.module('icons')
	.controller('stuffWidgetController', function($scope) {
		console.log('stuffWidgetController loaded');

		$scope.stuff = [];

		for(var i=1; i <= 6; i++) {
			$scope.stuff.push({
				src: 'placeholder://',
				title: 'Placeholder image',
				location: 'path/to/stuff'
			});
		}

		$scope.gotoStuff = function(location) {
			console.log('let\'s see ', location);
		};

	}).directive('iconsStuffWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/stuff/stuff-widget.html',
			controller: 'stuffWidgetController'
		};
	});