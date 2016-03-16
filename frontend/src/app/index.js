'use strict';

angular.module('icons', [
  'ngAnimate', 
  'ngCookies', 
  'ngTouch', 
  'ngSanitize', 
  'ngResource', 
  'ui.router', 
  'mm.foundation', 
  'react', 
  'ngFileUpload',
  'LocalStorageModule'
]).config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('iconsApp');


    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html'
      })
      .state('reset', {
        url: '/reset-password',
        templateUrl: 'app/reset/reset.html'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/register/register.html'
      })
      .state('upload', {
      	url: '/upload',
      	templateUrl: 'app/upload/upload.html',
      });

    $urlRouterProvider.otherwise('/');
}).run(function ($rootScope, $state, userService) {
  var restrictedStates = [
    'upload'
  ];


  $rootScope.$on('$stateChangeStart', function(e, toState, fromState, toParams, fromParams) {
    if(restrictedStates.indexOf(toState.name) >= 0) {
      if(!userService.isAuthenticated()) {
        e.preventDefault();
        $state.go('login');
      }
    }
  })
});
