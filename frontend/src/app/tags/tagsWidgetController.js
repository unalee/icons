angular.module('icons')
	.controller('tagsWidgetController', function($scope) {
		console.log('tagsWidgetController loaded');

		$scope.tags = [
			{
				text: 'pizza party',
				value: 'pizza-party'
			},
			{
				text: 'water',
				value: 'water'
			},
			{
				text: 'coffee',
				value: 'coffee'
			},
			{
				text: 'laptops',
				value: 'laptops'
			},
			{
				text: 'community',
				value: 'community'
			}
		];

		$scope.explore = function(tagName) {
			console.log('let\'s see ', tagName);
		}
	}).directive('iconsTagsWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/tags/tags-widget.html',
			controller: 'tagsWidgetController'
		};
	});