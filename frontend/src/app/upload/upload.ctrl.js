angular.module('icons')
	.controller('uploadController', function($scope, $rootScope, userService, Upload, $http, dataService, $state) {

    $scope.icon = {};
    $scope.icon.isUploading = false;

		$scope.submit = function() {
			if ($scope.uploadForm.file.$valid && $scope.file) {
        $rootScope.$broadcast('iconsShowActivityIndicator', true);
        $scope.icon.isUploading = true;
		    $scope.upload($scope.file);
		  }
		};

    $scope.fileChange = function(files, file, newFiles, duplicateFiles, invalidFiles, event) {
      if (file) {
        Upload.base64DataUrl(file).then(function (url) {
          $scope.icon.previewSrc = url;
        });
      }
    };

		// upload on file select or drop
    $scope.upload = function (file) {
      dataService.getSignedUrl(file).then(function (resp) {
        uploadFile(file, resp.data.signedRequest, resp.data.url);
      }, function (err) {
        console.log('Error status: ' + err.status);
        $rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: error.status
      	});
      });
    };

    var uploadFile = function(file, signedRequest, url){
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
          if(xhr.status === 200) {
            saveIcon(url);
          } else {
            $rootScope.$broadcast('iconsDisplayMessage', {
          		type: "alert",
          		message: "Unable to upload file to content server"
          	});
          }
        }
      };
      xhr.send(file);
    };

    var saveIcon = function(url) {
      const icon = {
        title: $scope.icon.title,
        tags: $scope.icon.tags,
        location: $scope.icon.location,
        story: $scope.icon.story,
        url: url
      };

      $http({
        url: '/api/icon',
        method: 'PUT',
        data: icon,
        headers: userService.getAccessHeaders()
      }).then(function (resp) {
        const savedIcon = resp.data;
        if (savedIcon._id) {
          $state.go('iconDetail', {iconId: savedIcon._id});
        }
      }, function (err) {
        $rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: "Error saving Icon to db."
      	});
      });
    };
  });
