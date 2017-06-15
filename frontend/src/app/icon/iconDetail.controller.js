'use strict';

angular.module('icons')
  .controller('iconDetailCtrl', function ($scope, $rootScope, $stateParams, dataService, $http) {

  	$scope.icons = [];
  	$scope.icon = {};
  	//$scope.loading = true;
    const iconId = $stateParams.iconId;

    if (angular.isDefined(iconId)) {
      dataService.getIcon(iconId).then(function(res) {
        console.log(res.data);
        $scope.icon = res.data;
      }, function(error) {
        $rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: error.message
      	});
      });
    }

  });
