'use strict';

angular.module('icons')
	.service('dataService', function($http, $rootScope, userService) {

		var dataAPI = {};

    dataAPI.getIcon = function(iconId) {
      return $http({
        url: '/api/icon/' + iconId,
        method: 'GET'
      });
    };

    dataAPI.getAllIcons = function() {
      return $http({
        url: '/api/icon/all',
        method: 'GET'
      });
    };

    dataAPI.getSignedUrl = function(file) {
      return $http({
          url: '/api/sign?file-name=' + file.name + '&file-type='+file.type,
          headers: userService.getAccessHeaders(),
          method: 'POST'
      });
    };

    return dataAPI;
  });
