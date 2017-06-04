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
]).config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "localStorageServiceProvider", function ($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {

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
}]).run(["$rootScope", "$state", "$document", "userService", function ($rootScope, $state, $document, userService) {
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
}]);

'use strict';

angular.module('icons')
	.service('userService', ["$http", "$rootScope", "$state", "localStorageService", function($http, $rootScope, $state, localStorageService) {

		var userAPI = {};
		var config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		var getCurrentSessionToken = function() {
			return localStorageService.get("userToken");
		};

		var currentUser = getCurrentSessionToken();

		userAPI.logIn = function(creds) {
			$http.post('/auth/login', creds, config).success(function(res, status, headers, config) {
				console.log("res:",res);
				if(angular.isDefined(res.token)) {
					console.log("user logged in successfully");
					localStorageService.set("userToken", res.token);
					$state.go('upload');
				} else {
					$rootScope.$broadcast('iconsDisplayMessage', {
						type: "alert",
						message: "Incorrect email or password. Please try again."
					});
				}
			}).error(function(data, status, headers, config) {
				console.error(data, status, headers)
				$rootScope.$broadcast('iconsDisplayMessage', {
					type: "alert",
					message: "Oops, something went wrong. Please try again."
				});
			});
		};

		userAPI.logOut = function() {
			$http.post('/auth/logout', {}, config).success(function(res){
				localStorageService.remove("userToken");
			}).error(function(data, status, headers, config) {
				$rootScope.$broadcast('iconsDisplayMessage', {
					type: "alert",
					message: "Oops, something went wrong. Please try again."
				});
			});
		};

    userAPI.getCurrentSessionToken = getCurrentSessionToken;

		userAPI.isAuthenticated = function() {
			return getCurrentSessionToken() !== null;
		};

		userAPI.register = function(newUser) {

			$http.post('/auth/signup', newUser, config).success(function(res) {
				console.log(res);
				if(angular.isDefined(res.token)) {
					localStorageService.set("userToken", res.token);
					$state.go('upload');
					$rootScope.$broadcast('iconsDisplayMessage', {
						type: "success",
						message: "Account created successfully."
					});
				} else {
					$rootScope.$broadcast('iconsDisplayMessage', {
						type: "alert",
						message: "Oops. An error occured."
					});
				}
			}).error(function(data, status, headers, config) {
				$rootScope.$broadcast('iconsDisplayMessage', {
					type: "alert",
					message: "Oops, something went wrong. Please try again."
				});
			});
		}

		return userAPI;
}]);

angular.module('icons')
	.controller('uploadController', ["$scope", "userService", "Upload", "$http", function($scope, userService, Upload, $http) {

		$scope.submit = function() {
			if ($scope.uploadForm.file.$valid && $scope.file) {
		    $scope.upload($scope.file);
		  }
		};

    $scope.icon = {};

    $scope.fileChange = function(files, file, newFiles, duplicateFiles, invalidFiles, event) {
      $scope.icon.previewSrc = newFiles[0].$ngfDataUrl;
    };

    const headers = {
      'x-access-token': userService.getCurrentSessionToken(),
    };

    console.log(headers);

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

            const icon = {
              title: $scope.title,
              tags: $scope.tags,
              location: $scope.location,
              story: $scope.story,
              url: url
            };

            $http({
              url: '/icon',
              method: 'PUT',
              data: icon,
              headers: headers
            }).then(function (resp) {
              debugger;
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
  }]);

angular.module('icons')
	.controller('tagsWidgetController', ["$scope", function($scope) {
		console.log('tagsWidgetController loaded');

		$scope.tags = [
			{
				text: 'pizza party',
				value: 'pizza-party'
			},
			{
				text: 'water',
				value: 'water'
			},
			{
				text: 'coffee',
				value: 'coffee'
			},
			{
				text: 'laptops',
				value: 'laptops'
			},
			{
				text: 'community',
				value: 'community'
			}
		];

		$scope.explore = function(tagName) {
			console.log('let\'s see ', tagName);
		}
	}]).directive('iconsTagsWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/tags/tags-widget.html',
			controller: 'tagsWidgetController'
		};
	});
angular.module('icons')
	.controller('stuffWidgetController', ["$scope", function($scope) {
		console.log('stuffWidgetController loaded');

		$scope.stuff = [];

		for(var i=1; i <= 6; i++) {
			$scope.stuff.push({
				src: 'placeholder://',
				title: 'Placeholder image',
				location: 'path/to/stuff'
			});
		}

		$scope.gotoStuff = function(location) {
			console.log('let\'s see ', location);
		};

	}]).directive('iconsStuffWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/stuff/stuff-widget.html',
			controller: 'stuffWidgetController'
		};
	});
angular.module('icons')
	.controller('searchController', ["$scope", function($scope) {
		console.log('searchController loaded');
	}]).directive('iconsSearch', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/search/search.html',
			controller: 'searchController'
		};
	});
'use strict';

angular.module('icons')
  .controller('passwordResetCtrl', ["$scope", "userService", function ($scope, userService) {
    $scope.date = new Date();
    $scope.user = {};
    $scope.loggedIn = false; //#security

    

  }]);

angular.module('icons')
	.controller('latestRemixCtrl', ["$scope", "$http", function($scope, $http) {

		$scope.icons = [];
		$http.get('/assets/json/icons.json').success(function(data) {
    	
    		for(var i = 0; i < data.length; i++) {
    			if(angular.isDefined(data[i].parent)) {
    				$scope.icon = data[i];
    				$scope.icon.id = i;
    			}
    		}

	    }).error(function() {
	    	$rootScope.$broadcast('iconsDisplayMessage', {
	    		type: "alert",
	    		message: "Oops, something went wrong loading icons."
	    	});
	    });


	}]).directive('iconsLatestRemix', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/remix/latest-remix.html',
			controller: 'latestRemixCtrl'
		};
	});
'use strict';

angular.module('icons')
  .controller('registerCtrl', ["$scope", "userService", function ($scope, userService) {
    $scope.date = new Date();
    $scope.user = {};
    $scope.loggedIn = false; //#security

    $scope.register = function() {
    	console.log($scope.user);
    	userService.register($scope.user);
    };

  }]);

angular.module('icons')
	.controller('newsController', ["$scope", function($scope) {
		console.log('newsController loaded');
	}]).directive('iconsNews', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/news/news.html',
			controller: 'newsController'
		};
	});
'use strict';

angular.module('icons')
.directive('navbar', ["$timeout", function($timeout) {
	return {
		restrict: 'E',
		templateUrl: 'app/navbar/navbar.html',
		controller: 'navbarCtrl',
		link: function(scope, element, attrs) {
			$timeout(function() {
				$(element).foundation();
			},20);	
		}
	};
}]);
'use strict';

angular.module('icons')
  .controller('navbarCtrl', ["$scope", "userService", function ($scope, userService) {
    $scope.date = new Date();
    $scope.loggedIn = false; //#security

    $scope.logIn = function() {
    	userService.logIn($scope.user);
    }

    $scope.logOut = function() {
    	userService.logOut();
    };

    $scope.validUser = function() {
        //return true;
        return userService.isAuthenticated();
    };

  }]);

'use strict';

angular.module('icons')
.directive('iconsMessages', ["$timeout", "$compile", function($timeout, $compile) {
	return {
    template: '<div class="messages"></div>',
    restrict: 'E',
    controller: 'messagesCtrl',
    link: function postLink(scope, element, attrs) {
    	scope.$on('iconsDisplayMessage', function(e,data) {
    		element.append('<div class="'+data.type+'" icons-message>'+data.message+'</div>');
        $compile(element.contents())(scope);
    	});

    	scope.clear = function() {
    		element.find('.alert-box').remove();
    	}
    }
  };
}]).controller('messagesCtrl', ["$scope", "$document", function($scope,$document) {

	$scope.close = function(event) {
		console.log(event);
		$scope.clear();
	}

	$scope.restartFoundation = function() {
		$($document).foundation('alert', 'reflow');
	}
}]);

$(document).ready(function() {
	$('#stickyTopBar').on('sticky.zf.stuckto:top', function() {
		console.log('stuck!');
	})
});
'use strict';

angular.module('icons')
.directive('iconsMessage', ["$timeout", function($timeout) {
	console.log('load');
	return {
    	restrict: 'A',
    	link: function postLink(scope, element, attrs) {
      		console.log('rmself')
    		$timeout(function() {
        		element.remove();
      		},3000);
    	}
  	};
}]);
'use strict';

angular.module('icons')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      {
        'title': 'AngularJS',
        'url': 'https://angularjs.org/',
        'description': 'HTML enhanced for web apps!',
        'logo': 'angular.png'
      },
      {
        'title': 'BrowserSync',
        'url': 'http://browsersync.io/',
        'description': 'Time-saving synchronised browser testing.',
        'logo': 'browsersync.png'
      },
      {
        'title': 'GulpJS',
        'url': 'http://gulpjs.com/',
        'description': 'The streaming build system.',
        'logo': 'gulp.png'
      },
      {
        'title': 'Jasmine',
        'url': 'http://jasmine.github.io/',
        'description': 'Behavior-Driven JavaScript.',
        'logo': 'jasmine.png'
      },
      {
        'title': 'Karma',
        'url': 'http://karma-runner.github.io/',
        'description': 'Spectacular Test Runner for JavaScript.',
        'logo': 'karma.png'
      },
      {
        'title': 'Protractor',
        'url': 'https://github.com/angular/protractor',
        'description': 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
        'logo': 'protractor.png'
      },
      {
        'title': 'jQuery',
        'url': 'http://jquery.com/',
        'description': 'jQuery is a fast, small, and feature-rich JavaScript library.',
        'logo': 'jquery.jpg'
      },
      {
        'title': 'Foundation',
        'url': 'http://foundation.zurb.com/',
        'description': 'The most advanced responsive front-end framework in the world.',
        'logo': 'foundation.png'
      },
      {
        'title': 'Angular Foundation',
        'url': 'http://pineconellc.github.io/angular-foundation/',
        'description': 'A set of native AngularJS directives based on Foundation\'s markup and CSS',
        'logo': 'angular-foundation.png'
      },
      {
        'title': 'Sass (Node)',
        'url': 'https://github.com/sass/node-sass',
        'description': 'Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.',
        'logo': 'node-sass.png'
      },
      {
        'key': 'handlebars',
        'title': 'Handlebars',
        'url': 'http://handlebarsjs.com/',
        'description': 'Handlebars provides the power necessary to let you build semantic templates effectively with no frustration.',
        'logo': 'handlebars.png'
      }
    ];
    angular.forEach($scope.awesomeThings, function(awesomeThing) {
      awesomeThing.rank = Math.random();
    });
  }]);

'use strict';

angular.module('icons')
  .controller('loginCtrl', ["$scope", "userService", "$rootScope", function ($scope, userService, $rootScope) {
    $scope.date = new Date();
    $scope.user = {};
    $scope.loggedIn = false; //#security

    $scope.logIn = function() {
      userService.logIn($scope.user).then(function(user) {
        console.log(user);
      });
    };

    $scope.logOut = function() {
      userService.logOut();
    };

    $scope.validUser = function() {
        return userService.isAuthenticated();
    };

    $scope.addMessage = function() {
        $rootScope.$broadcast('iconsDisplayMessage', {
            type: "alert",
            message: "Test"
        });
    }

  }]);

angular.module('icons')
	.controller('latestImagesCtrl', ["$scope", "$http", function($scope, $http) {
		console.log('graphicsWidgetController loaded');

		$scope.icons = [];
		$http.get('/assets/json/icons.json').success(function(data) {
    	
    		for(var i = 0; i < $scope.limit; i++) {
    			$scope.icons.push(data[i]);
    		}

	    }).error(function() {
	    	$rootScope.$broadcast('iconsDisplayMessage', {
	    		type: "alert",
	    		message: "Oops, something went wrong loading icons."
	    	});
	    });


	}]).directive('iconsLatestImagesWidget', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				limit: '@'
			},
			templateUrl: 'app/images/latest-images-widget.html',
			controller: 'latestImagesCtrl'
		};
	});
'use strict';

angular.module('icons')
  .controller('iconDetailCtrl', ["$scope", "$rootScope", "$state", "$http", function ($scope, $rootScope, $state, $http) {

  	$scope.icons = [];
  	$scope.icon = {};
  	//$scope.loading = true;
    $http.get('/assets/json/icons.json').success(function(data) {
    	
    	$scope.icons = data;
    	if(angular.isDefined($state.params.iconId)) {
    		$scope.icon = $scope.icons[parseInt($state.params.iconId)];
    	}

    }).error(function() {
    	$rootScope.$broadcast('iconsDisplayMessage', {
    		type: "alert",
    		message: "Oops, something went wrong loading this icon. Please try again."
    	});
    });

  }]);

angular.module('icons')
	.controller('upcomingEventsCtrl', ["$scope", "$http", function($scope, $http) {

		$scope.events = [];
		$http.get('/assets/json/events.json').success(function(data) {
    	
    		for(var i = 0; i < $scope.limit; i++) {
    			$scope.events.push(data[i]);
    		}

	    }).error(function() {
	    	$rootScope.$broadcast('iconsDisplayMessage', {
	    		type: "alert",
	    		message: "Oops, something went wrong loading icons."
	    	});
	    });


	}]).directive('iconsUpcomingEvents', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				limit: '@'
			},
			templateUrl: 'app/events/upcoming-events.html',
			controller: 'upcomingEventsCtrl'
		};
	});
angular.module('icons')
	.controller('latestEventCtrl', ["$scope", "$http", function($scope, $http) {

		$scope.event = {
			image: 'Latest-Event.jpg',
			link: 'hahaha'
		};

	}]).directive('iconsLatestEvent', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/events/latest-event.html',
			controller: 'latestEventCtrl'
		};
	});
angular.module("icons").run(["$templateCache", function($templateCache) {$templateCache.put("app/about/about.html","<div class=\"container\"><div class=\"row\"><div class=\"large-12 large-text-center columns\"><h2 class=\"section-heading\">About</h2><h1 class=\"about\">Visionary Images for Social Movements</h1><img class=\"full-width\" src=\"/assets/images/about/IMG_7720.jpg\"><p class=\"image-caption\">Icon Design Workshop, Toronto, 2015</p></div></div><div class=\"row\"><div class=\"large-8 small-12 columns\"><p>Our movements need more images! Social justice organizers have a wide visual vocabulary of protest — raised fists, barbed wire, marchers holding placards — but should we not also depict the world we are building in addition to the forces we’re resisting? How can we communicate concepts we hold dear; concepts like beloved community, allyship, and consent?</p><p>The Vision Archive brings together designers, artists, advocates, and community organizers to co-create images for the world we want to build. Visionarchive.io is like a “Github for visionary social justice images,” allowing users to upload images so other users can download and remix them and upload their new creations.</p><h4 class=\"about\">History</h4><p>The Vision Archive was conceived in 2014 by Una Lee. As a designer working within social movements, she was concerned by some of the trends she was noticing in movement imagery. On the one hand, clipart of raised fists and barbed wire had become visual shorthand for community organizing. On the other hand, some organizations were leaning towards more a more “professional” i.e. bland aesthetic in the hopes of seeming more credible to funders. She worried that these aesthetic directions did not do justice to the visionary work that organizers do.</p><p>Knowing that what we see shapes what we believe is possible, Una felt a need to shift the visual culture of social movements. What if social movement imagery were visionary in addition to being critical? And what if it were created by organizers and community members to reflect the world they are working towards?</p><p>In May 2014, Una led the first “design justice jam” and through a series of participatory activities facilitated 24 activists and artists in the creation of the first set of visionary icons. This was followed by a workshop a year later, for Mayworks 2015. Later that summer, Una teamed up with designer/scholar Gracen Brilmyer, front end developer Jeff Debutte, and backend developer Alex Leitch to build visionarchive.io to house the icons.</p><p>Workshops to date<br>Toronto, Bento Miso, May 2014<br>Toronto, Mayworks, May 2015<br>Brewster, NY, Creative Solutions Symposium, August 2015<br>Berkeley, School of Information, UC Berkeley, March 2016<br>Toronto, Centre for Social Innovation, Regent Park, June 2016</p></div><div class=\"large-4 small-12 columns\"><img src=\"assets/images/about/IMG_3509.jpg\"><p class=\"image-caption\">Building on the icons in the poster design workshop, Toronto, June 2016</p><img src=\"assets/images/about/IMG_0069.JPG\"><p class=\"image-caption\">Collaboration in the poster design workshop, Toronto, June 2016</p></div></div><div class=\"row supported-by\"><div class=\"small-12 columns\"><h4>Supported By</h4></div><div class=\"large-6 small-12 columns\"><img src=\"assets/images/about/CTSP_Logo_2x1.png\"></div><div class=\"large-6 small-12 columns\"><img src=\"assets/images/about/AAT-Logo.png\"></div></div></div>");
$templateCache.put("app/events/latest-event.html","<div class=\"latest-event\"><h3>Latest Event</h3><img ng-src=\"/assets/images/{{event.image}}\" <=\"\" div=\"\"></div>");
$templateCache.put("app/events/upcoming-events.html","<div class=\"upcoming-events\"><h3>Upcoming Events</h3><div ng-repeat=\"event in events\"><h4>{{event.city}}</h4><p class=\"date\">{{event.date}}</p><p class=\"title\">{{event.title}}</p><p class=\"presenters\">{{event.presenters}}</p><p class=\"location\" ng-if=\"event.location\">{{event.location}}</p><p class=\"time\" ng-if=\"event.time\">{{event.time}}</p><a class=\"more\" ng-if=\"event.description\">More</a></div></div>");
$templateCache.put("app/icon/icon-list.html","<div class=\"icons-list\" ng-controller=\"iconDetailCtrl\"><icons-messages></icons-messages><div class=\"graphics-widget-items row small-up-1 medium-up-3 large-up-4\"><div class=\"column\" ng-repeat=\"icon in icons\"><h4>{{icon.title}}</h4><a href=\"/#/icon?iconId={{$index}}\"><img class=\"graphic-item\" ng-src=\"/assets/images/{{icon.filename}}\" title=\"{{icon.title}}\"></a><p>{{icon.location}}, {{icon.date}}</p></div></div></div>");
$templateCache.put("app/icon/icon.html","<div class=\"icon\" ng-controller=\"iconDetailCtrl\"><icons-messages></icons-messages><div class=\"row\"><div class=\"large-8 small-12 columns\"><h2>{{icon.title}}</h2><img class=\"graphic-item\" ng-src=\"/assets/images/{{icon.filename}}\" title=\"{{icon.title}}\"></div><div class=\"large-4 small-12 columns\"><button class=\"button expand\">Download Source</button><div class=\"detail authors\"><h4>Authors:</h4><p>{{icon.author1}} <span ng-if=\"icon.author2\">, {{icon.author2}}</span><span ng-if=\"icon.author3\">, {{icon.author3}}</span></p></div><div class=\"detail added\"><h4>Added:</h4><p>{{icon.date}}</p></div><div class=\"detail location\"><h4>Location:</h4><p>{{icon.location}}</p></div><div class=\"detail tags\"><h4>Tags:</h4><p><a class=\"tag\" ng-repeat=\"tag in icon.tags\" ng-click=\"explore(tag.value)\">{{tag}}{{$last ? \'\' : \', \'}}</a></p></div><div ng-if=\"icon.remixes\" class=\"detail related\"><h4>Remixes:</h4><div class=\"related-icon\" ng-repeat=\"id in icon.remixes\"><h5>{{icons[id].title}}</h5><a href=\"/#/icon?iconId={{id}}\"><img class=\"graphic-item\" ng-src=\"/assets/images/{{icons[id].filename}}\" title=\"{{icons[id].title}}\"></a></div></div><div ng-if=\"icon.parent\" class=\"detail related\"><h4>Created With:</h4><div class=\"related-icon\" ng-repeat=\"id in icon.parent\"><h5>{{icons[id].title}}</h5><a href=\"/#/icon?iconId={{id}}\"><img class=\"graphic-item\" ng-src=\"/assets/images/{{icons[id].filename}}\" title=\"{{icons[id].title}}\"></a></div></div></div></div><div ng-if=\"loading\" class=\"loading-indicator\"></div></div>");
$templateCache.put("app/images/latest-images-widget.html","<div class=\"graphics-widget-items\"><div class=\"row small-up-3\"><div class=\"column\" ng-repeat=\"icon in icons\"><a href=\"/#/icon?iconId={{$index}}\"><img class=\"graphic-item\" ng-src=\"/assets/images/{{icon.filename}}\" title=\"{{icon.title}}\"><br>{{icon.title}}</a></div></div></div>");
$templateCache.put("app/login/login.html","<div class=\"row medium-6 medium-centered large-4 large-centered columns\"><icons-messages></icons-messages><form ng-controller=\"loginCtrl\" ng-submit=\"logIn()\"><div class=\"log-in-form\"><h4 class=\"text-center\">Log in</h4><label>Username <input type=\"email\" placeholder=\"Username\" ng-model=\"user.email\" required=\"\"></label> <label>Password <input type=\"password\" placeholder=\"Password\" ng-model=\"user.password\" required=\"\"></label> <button type=\"submit\" class=\"button expand\">Log In</button><p class=\"text-center\"><a ui-sref=\"password\">Forgot your password?</a></p></div></form></div>");
$templateCache.put("app/main/main.html","<div class=\"container\"><div class=\"row\"><div class=\"large-12 large-text-center columns\"><icons-search></icons-search></div></div><div class=\"home-banner row\"><div class=\"large-12 columns\"><div class=\"banner-container\"><img src=\"/assets/images/Banner.png\"><div class=\"pull-up\"><a ui-sref=\"upload\" class=\"button\">Upload An Image</a></div></div></div></div><div class=\"home-animation row\"><div class=\"large-12 columns\"><div class=\"mission-statement-container\"><h2 class=\"center-title\">Visionary Images<br>For Social Movements</h2><img src=\"/assets/images/Home-page-animation.gif\"><div class=\"overlay\"><a ui-sref=\"upload\" class=\"button left\">Upload An Image</a><div class=\"circle\"><a ui-sref=\"something\" class=\"button\">Learn<br>More</a></div><a ui-sref=\"upload\" class=\"button right\">Upload A Remix</a></div></div></div></div><div class=\"row\"><div class=\"small-12 medium-6 columns\"><h3>Latest Images To Remix</h3><icons-latest-images-widget limit=\"6\"></icons-latest-images-widget></div><div class=\"small-12 medium-6 columns\"><h3>Latest Remix</h3><icons-latest-remix></icons-latest-remix></div></div><div class=\"row\"><div class=\"small-12 medium-6 columns\"><icons-upcoming-events limit=\"3\"></icons-upcoming-events></div><div class=\"small-12 medium-6 columns\"><icons-latest-event></icons-latest-event></div></div></div>");
$templateCache.put("app/navbar/navbar.html","<div class=\"navbar-row\"><div class=\"top-bar-left\"><ul class=\"menu\"><li ui-sref-active=\"active\"><a ui-sref=\"iconList\">Icons</a></li><li ui-sref-active=\"active\"><a ui-sref=\"about\">About</a></li></ul></div><div class=\"top-bar-right\"><ul class=\"menu dropdown\" data-dropdown-menu=\"\"><li ng-if=\"validUser()\"><a href=\"#\">My Account</a><ul class=\"menu vertical\"><li ui-sref-active=\"active\"><a ui-sref=\"upload\">Upload</a></li><li><a href=\"#\" ng-click=\"logOut()\">logout</a></li></ul></li><li ng-if=\"!validUser()\" ui-sref-active=\"active\" class=\"register\"><a ui-sref=\"register\">Create an account</a></li><li ng-if=\"!validUser()\" ui-sref-active=\"active\"><a ui-sref=\"login\">Login</a></li></ul></div></div>");
$templateCache.put("app/news/news.html","<div class=\"news\"><h3>Important new announcement goes here</h3></div>");
$templateCache.put("app/register/register.html","<div class=\"row medium-8 medium-centered large-6 large-centered columns\"><icons-messages></icons-messages><form ng-controller=\"registerCtrl\" ng-submit=\"register()\" data-abide=\"\"><div class=\"register-form\"><h4 class=\"text-center\">Create an account</h4><label>Email <input type=\"email\" placeholder=\"\" ng-model=\"user.email\" required=\"\"></label> <label>Full Name <input type=\"text\" placeholder=\"\" ng-model=\"user.name\" required=\"\"></label><fieldset><legend>Password</legend><label>Choose a Password <input type=\"password\" placeholder=\"Password\" name=\"password\" id=\"password\" ng-model=\"user.password\" required=\"\"></label><div class=\"input-element\"><label>Confirm Password <input type=\"password\" placeholder=\"Confirm Password\" data-equalto=\"password\" required=\"\"></label> <small class=\"error\">The passwords do not match</small></div></fieldset><button type=\"submit\" class=\"button expand success\">Create Account</button></div></form></div>");
$templateCache.put("app/remix/latest-remix.html","<div class=\"latest-remix\"><a href=\"/#/icon?iconId={{icon.id}}\"><img class=\"graphic-item\" ng-src=\"/assets/images/{{icon.filename}}\" title=\"{{icon.title}}\"><br>{{icon.title}}</a></div>");
$templateCache.put("app/reset/reset.html","<div class=\"row medium-6 medium-centered large-4 large-centered columns\"><form ng-controller=\"passwordResetCtrl\" ng-submit=\"resetPassword()\" data-abide=\"\"><div class=\"log-in-form\"><h4 class=\"text-center\">Reset your password</h4><p>Enter your email address below if you\'ve lost or forgotten your password. We will send you an email with further instructions</p><label>Email <input type=\"email\" placeholder=\"you@example.com\" ng-model=\"user.username\" required=\"\"></label> <button type=\"submit\" class=\"button expand\">Reset</button></div></form></div>");
$templateCache.put("app/search/search.html","<div class=\"search\"><label>Search:</label> <input type=\"text\" placeholder=\"SEARCH TAGGED IMAGES OF A BETTER WORLD\" class=\"home-search\"></div>");
$templateCache.put("app/stuff/stuff-widget.html","<div class=\"stuff-widget-items\"><ul class=\"small-block-grid-1\"><li ng-repeat=\"thing in stuff\" ng-click=\"gotoStuff(thing.location)\"><div class=\"stuff-item\"></div></li></ul></div>");
$templateCache.put("app/tags/tags-widget.html","<div class=\"tags-widget\"><h3>Popular Tags</h3><div class=\"tags-list\"><a class=\"tag\" ng-repeat=\"tag in tags\" ng-click=\"explore(tag.value)\">{{tag.text}}{{$last ? \'\' : \', \'}}</a></div></div>");
$templateCache.put("app/upload/upload.html","<div class=\"row medium-6 medium-centered large-4 large-centered columns\"><icons-messages></icons-messages><form name=\"uploadForm\" ng-submit=\"submit()\" ng-controller=\"uploadController\"><div class=\"form-item\"><label for=\"title\">Title</label> <input type=\"text\" name=\"title\" ng-model=\"icon.title\" placeholder=\"Title\"></div><div class=\"form-item\"><label for=\"file\">File</label> <img ng-if=\"icon.previewSrc\" ng-src=\"{{icon.previewSrc}}\"><div class=\"button\" ngf-select=\"\" ng-model=\"file\" name=\"file\" ngf-pattern=\"\'image/*\'\" ngf-accept=\"\'image/*\'\" ngf-max-size=\"20MB\" ngf-min-height=\"100\" ngf-resize=\"{width: 100, height: 100}\" ngf-change=\"fileChange($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event)\">Select</div></div><div class=\"form-item\"><label for=\"tags\">Location</label> <input type=\"text\" name=\"location\" ng-model=\"icon.location\" placeholder=\"Location\"></div><div class=\"form-item\"><label for=\"tags\">Tags</label> <input type=\"text\" name=\"tags\" ng-model=\"icon.tags\" placeholder=\"Tags (enter comma separated)\"></div><div class=\"form-item\"><label for=\"story\">Story</label> <textarea type=\"text\" name=\"story\" ng-model=\"icon.story\" placeholder=\"Story\"></textarea></div><div class=\"submit-button\"><button type=\"submit\">Submit</button></div></form></div>");}]);