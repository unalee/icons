'use strict';

angular.module('icons')
.directive('iconsRemoveSelf', function($timeout) {
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