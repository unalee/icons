'use strict';

angular.module('icons')
	.service('dataService', function($http, $rootScope, userService) {

		var dataAPI = {};

    dataAPI.getIcon = function(iconId) {
      return $http({
        url: '/api/icon/' + iconId,
        method: 'GET',
        headers: userService.getAccessHeaders(),
      });
    };

    dataAPI.getAllIcons = function(options) {
      options = options || {};
      var params = [];
      var url = '/api/icon';
      if (options.limit) {
        params.push('limit='+options.limit);
      }
      if (options.skip) {
        params.push('skip='+options.skip);
      }
      return $http({
        url: params.length > 0 ? url + '?' + params.join('&') : url,
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

    dataAPI.getIconsWithTag = function(tag) {
      return $http({
        url: '/api/tag/' + tag.toString(),
        method: 'GET'
      });
    }

    return dataAPI;
  });
