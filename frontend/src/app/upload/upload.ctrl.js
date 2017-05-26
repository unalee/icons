angular.module('icons')
	.controller('uploadController', function($scope, userService, Upload, $http) {

		$scope.submit = function() {
			if ($scope.uploadForm.file.$valid && $scope.file) {
		    $scope.upload($scope.file);
		  }
		};

    $scope.fileChange = function(files, file, newFiles, duplicateFiles, invalidFiles, event) {
      console.log(files, file, newFiles, duplicateFiles, invalidFiles, event);
    };

    const headers = {
      'x-access-token': userService.getCurrentSessionToken(),
    };

		// upload on file select or drop
    $scope.upload = function (file) {
      $http({
          url: '/api/sign?file-name=' + file.name + '&file-type='+file.type,
          headers: headers,
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
            document.getElementById('preview').src = url;
            document.getElementById('avatar-url').value = url;
            const icon = {
              title: $scope.title,
              tags: $scope.tags,
              url: url
            };

            $http({
              url: '/icon',
              method: 'PUT',
              data: icon,
              headers: headers
            }).then(function (resp) {
              console.log('Yay resp!' + resp);
            }, function (err) {
              console.error('Error status ' + err.status);
            });
          }
          else{
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }
  });
