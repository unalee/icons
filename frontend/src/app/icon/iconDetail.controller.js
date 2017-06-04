'use strict';

angular.module('icons')
  .controller('iconDetailCtrl', function ($scope, $rootScope, $stateParams, userService, $http) {

  	$scope.icons = [];
  	$scope.icon = {};
  	//$scope.loading = true;
    const iconId = $stateParams.iconId;

    if (angular.isDefined(iconId)) {
      $http({
        url: '/api/icon/' + iconId,
        method: 'GET',
        headers: userService.getAccessHeaders()
      }).success(function(icon) {
        $scope.icon = icon;
        $scope.icon.authors = icon.admin.map(function(a) {
          return JSON.parse(a);
        });
      }).error(function() {
      	$rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: "Oops, something went wrong loading this icon. Please try again."
      	});
      });

    }



  });
