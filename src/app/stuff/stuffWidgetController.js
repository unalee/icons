angular.module('icons')
	.controller('stuffWidgetController', function($scope) {
		console.log('stuffWidgetController loaded');

		$scope.stuff = [];

		for(var i=1; i <= 6; i++) {
			$scope.stuff.push({});
		}

		$scope.explore = function(tagName) {
			console.log('let\'s see ', tagName);
		}

	}).directive('iconsStuffWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/stuff/stuff-widget.html',
			controller: 'stuffWidgetController'
		};
	});