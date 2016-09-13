'use strict';

angular.module('icons')
.directive('iconsMessage', function($timeout) {
	console.log('load');
	return {
    	restrict: 'A',
    	link: function postLink(scope, element, attrs) {
      		console.log('rmself')
    		$timeout(function() {
        		element.remove();
      		},3000);
    	}
  	};
});