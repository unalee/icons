'use strict';

angular.module('icons')
  .controller('iconsListCtrl', function ($scope, $rootScope, dataService, $stateParams, $http) {

  	$scope.icons = [];
  	$scope.icon = {};

    console.log($stateParams);
    if ($stateParams.tag) {
      dataService.getIconsWithTag($stateParams.tag).then(function(res) {
        console.warn(res);
        $scope.icons = res.data;
      },function(error) {
        $rootScope.$broadcast('iconsDisplayMessage', {
          type: "alert",
          message: "Oops, something went wrong loading this icon. Please try again."
        });
      });
    } else {
      dataService.getAllIcons().then(function(res) {
        $scope.icons = res.data;
      },function(error) {
      	$rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: "Oops, something went wrong loading this icon. Please try again."
      	});
      });
    }



  });
