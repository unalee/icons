angular.module('icons')
	.controller('uploadController', function($scope, userService, Upload, $http) {

		$scope.submit = function() {
			if ($scope.uploadForm.file.$valid && $scope.file) {
		    $scope.upload($scope.file);
		  }
		};

    $scope.icon = {};

    $scope.fileChange = function(files, file, newFiles, duplicateFiles, invalidFiles, event) {
      if (file) {
        Upload.base64DataUrl(file).then(function (url) {
            $scope.icon.previewSrc = url;
        });
      }
    };



		// upload on file select or drop
    $scope.upload = function (file) {
      $http({
          url: '/api/sign?file-name=' + file.name + '&file-type='+file.type,
          headers: userService.getAccessHeaders(),
          method: 'POST'
      }).then(function (resp) {
          console.warn(resp);
          uploadFile(file, resp.data.signedRequest, resp.data.url);
      }, function (err) {
          console.log('Error status: ' + err.status);
      }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    };

    var uploadFile = function(file, signedRequest, url){
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            saveIcon(url);
          }
          else{
            alert('Could not upload file.');
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
          console.log('Yay icon!' + savedIcon);
        }

      }, function (err) {
        console.error('Error status ' + err.status);
      });
    };
  });
