'use strict';

angular.module('icons')
.directive('iconsMessages', function($timeout, $compile) {
	return {
    template: '<div class="messages"></div>',
    restrict: 'E',
    controller: 'messagesCtrl',
    link: function postLink(scope, element, attrs) {
    	scope.$on('iconsDisplayMessage', function(e,data) {
    		element.append('<div class="'+data.type+'" icons-message>'+data.message+'</div>');
        $compile(element.contents())(scope);
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
