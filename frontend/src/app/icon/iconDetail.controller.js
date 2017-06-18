'use strict';

angular.module('icons')
  .controller('iconDetailCtrl', function ($scope, $rootScope, $stateParams, $state, dataService) {

  	$scope.icons = [];
  	$scope.icon = {};
    var iconId = $stateParams.iconId;

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

    $scope.delete = function() {
      var r = confirm("Are you sure you want to delete this icon?");
      if (r == true) {
        var deleteIconId = $scope.icon._id
        if (deleteIconId) {
          dataService.deleteIcon(deleteIconId).then(function(res) {
            $rootScope.$broadcast('iconsDisplayMessage', {
          		type: "success",
          		message: "Icon deleted successfully"
          	});
            $state.go('iconList', {});
          }, function(error) {
            $rootScope.$broadcast('iconsDisplayMessage', {
          		type: "alert",
          		message: error.message
          	});
          })
        }
      }
    };


    $scope.edit = function() {
      $scope.editMode = true;
      $scope.icon.newTags = $scope.icon.tags.join(', ');
    }

    $scope.cancel = function() {
      $scope.editMode = false;
    }

    $scope.save = function() {
      dataService.updateIcon($scope.icon).then(function(res) {
        $rootScope.$broadcast('iconsDisplayMessage', {
          type: "success",
          message: "Icon updated"
        });
        $scope.editMode = false;
        $scope.icon = res.data;
      }, function(error) {
        $rootScope.$broadcast('iconsDisplayMessage', {
          type: "alert",
          message: error.message
        });
      })
    }

  });
