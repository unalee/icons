'use strict';

angular.module('icons')
.directive('iconsActivityIndicator', function() {
	return {
    	restrict: 'E',
      templateUrl: 'app/loader/loader.directive.html',
      replace: true,
      controller: function($scope, $rootScope) {
        $scope.isLoading = false;
  			$scope.$on('iconsShowActivityIndicator', function(value) {
          $rootScope.showLoading = !!value;
        });
  		}
  	};
});
