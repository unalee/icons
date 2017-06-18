angular.module('icons')
	.controller('latestImagesCtrl', function($scope, dataService) {

		$scope.icons = [];

    dataService.getAllIcons({limit: 6}).then(function(res) {
      $scope.icons = res.data;
    }, function(error) {
      console.error(error);
    });


	}).directive('iconsLatestImagesWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				limit: '@'
			},
			templateUrl: 'app/images/latest-images-widget.html',
			controller: 'latestImagesCtrl'
		};
	});
