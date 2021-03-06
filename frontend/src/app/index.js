'use strict';

angular.module('icons', [
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ngResource',
  'ui.router',
  'ngFileUpload',
  'LocalStorageModule',
  'angular-momentjs'
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
      	url: '/upload?parentId',
      	templateUrl: 'app/upload/upload.html',
      })
      .state('iconDetail', {
        url: '/icon?iconId',
        templateUrl: 'app/icon/icon.html'
      })
      .state('iconList', {
        url: '/icons?tag',
        templateUrl: 'app/icon/icon-list.html'
      });

    $urlRouterProvider.otherwise('/');
}).filter('moment', function($moment) {
  return function(input, format) {
    return $moment(input).format(format);
  };
}).run(function ($rootScope, $state, $document, userService, $timeout) {

  userService.checkCurrentToken().then(function(res) {
    userService.setTokenValid(res);
  }, function(error) {
    userService.setTokenValid(false);
  });

  var restrictedStates = [
    'upload'
  ];

  $(document).ready(function() {
    $(document).foundation();
  });

  $rootScope.$on('$stateChangeStart', function(e, toState, fromState, toParams, fromParams) {

  });

  $rootScope.$on('$stateChangeSuccess', function(e, toState, fromState, toParams, fromParams) {
    if($rootScope.showLoading) {
      $timeout(function() {
        $rootScope.showLoading = false;
      }, 500);
    }

    if(restrictedStates.indexOf(toState.name) >= 0) {
      $timeout(function() {
        if(!userService.isAuthenticated()) {
          e.preventDefault();
          $state.go('login');

          $rootScope.$broadcast('iconsDisplayMessage', {
  					type: "alert",
  					message: "You need to login to upload icons."
  				});
        }
      }, 1000);

    }
  });
});
