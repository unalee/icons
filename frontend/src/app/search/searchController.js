angular.module('icons')
	.controller('searchController', function($scope) {
		console.log('searchController loaded');
	}).directive('iconsSearch', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/search/search.html',
			controller: 'searchController'
		};
	});