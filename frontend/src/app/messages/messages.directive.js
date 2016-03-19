'use strict';

angular.module('icons')
.directive('iconsMessages', function() {
	return {
      template: '<div class="messages"></div>',
      restrict: 'E',
      controller: 'messagesCtrl',
      link: function postLink(scope, element, attrs) {
      	scope.$on('iconsDisplayMessage', function(e,data) {
      		element.append('<div data-alert class="alert-box ' + data.type + ' radius">'+data.message+'<a class="close" ng-click="close($event">&times;</a></div>');
      		scope.restartFoundation();
      	});

      	scope.clear = function() {
      		element.find('.alert-box').remove();
      	}
      }
    };
}).controller('messagesCtrl', function($scope,$document) {
	
	$scope.close = function(event) {
		console.log(event);
		$scope.clear();
	}

	$scope.restartFoundation = function() {
		$($document).foundation('alert', 'reflow');
	}
});