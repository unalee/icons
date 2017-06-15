angular.module('icons')
	.controller('tagsWidgetController', function($scope) {
		console.log('tagsWidgetController loaded');

		
	}).directive('iconsTagsWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/tags/tags-widget.html',
			controller: 'tagsWidgetController'
		};
	});
