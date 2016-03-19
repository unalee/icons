'use strict';

angular.module('icons', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mm.foundation', 'react', 'ngFileUpload'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('upload', {
      	url: '/upload',
      	templateUrl: 'app/upload/upload.html',
      });

    $urlRouterProvider.otherwise('/');
  })
;
