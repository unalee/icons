'use strict';

angular.module('icons')
.directive('iconsMessage', function($timeout) {
	console.log('load');
	return {
    	restrict: 'A',
    	link: function postLink(scope, element, attrs) {
        $timeout(function() {
          element.addClass('show');
        }, 50);
        $timeout(function() {
          element.removeClass('show');
        }, 3000)
    		$timeout(function() {
        	element.remove();
      	}, 3500);
    	}
  	};
});
