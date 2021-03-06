'use strict';

angular.module('icons')
.directive('navbar', function($timeout) {
	return {
		restrict: 'E',
		templateUrl: 'app/navbar/navbar.html',
		controller: 'navbarCtrl',
		link: function(scope, element, attrs) {
			$timeout(function() {
				$(element).foundation();
			},20);	
		}
	};
});