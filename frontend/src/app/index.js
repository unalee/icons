'use strict';

angular.module('icons', [
  'ngAnimate', 
  'ngCookies', 
  'ngTouch', 
  'ngSanitize', 
  'ngResource', 
  'ui.router',
  'ngFileUpload',
  'LocalStorageModule'
]).config(function ($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('iconsApp');
    $httpProvider.defaults.headers.common = { 'Content-Type' : 'application/json' };

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'app/about/about.html'
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
      })
      .state('iconDetail', {
        url: '/icon?iconId',
        templateUrl: 'app/icon/icon.html'
      })
      .state('iconList', {
        url: '/icons',
        templateUrl: 'app/icon/icon-list.html'
      });

    $urlRouterProvider.otherwise('/');
}).run(function ($rootScope, $state, $document, userService) {
  var restrictedStates = [
    'upload'
  ];

  $(document).foundation();

  $rootScope.$on('$stateChangeStart', function(e, toState, fromState, toParams, fromParams) {
    if(restrictedStates.indexOf(toState.name) >= 0) {
      if(!userService.isAuthenticated()) {
        e.preventDefault();
        $state.go('login');
      }
    }
  })
});
