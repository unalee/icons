angular.module('icons')
	.controller('uploadController', function($scope, $rootScope, Upload) {

		$scope.submit = function() {
			if ($scope.uploadForm.file.$valid && $scope.file) {
		        $scope.upload($scope.file);
		    }
		};

		$scope.uploadData = {
			error: false,
			success: false,
			inProgress: false
		};

		// upload on file select or drop
	    $scope.upload = function (file) {
	        Upload.upload({
	            url: 'upload/upload.py',
	            data: {file: file, 'username': $scope.username}
	        }).then(function (resp) {
	            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
	        }, function (resp) {
	            console.log('Error status: ' + resp.status);
	            $rootScope.$broadcast('iconsDisplayMessage', {
	            	type: 'error',
	            	message: 'Upload error: ' + resp.status
	            });
	            $scope.uploadData.error = true;
	        }, function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            $scope.upload.complete = progressPercentage;
	            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	        });
	    };
});