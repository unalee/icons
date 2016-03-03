angular.module('icons')
	.controller('newsController', function($scope) {
		console.log('newsController loaded');
	}).directive('iconsNews', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/news/news.html',
			controller: 'newsController'
		};
	});