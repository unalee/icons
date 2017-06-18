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
}]).filter('moment', ["$moment", function($moment) {
  return function(input, format) {
    return $moment(input).format(format);
  };
}]).run(["$rootScope", "$state", "$document", "userService", "$timeout", function ($rootScope, $state, $document, userService, $timeout) {

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

    var loggedIn = false;

		var getCurrentSessionToken = function() {
			return localStorageService.get("userToken");
		};

		userAPI.logIn = function(creds) {
			$http.post('/auth/login', creds, config).success(function(res, status, headers, config) {
				if(angular.isDefined(res.token)) {
					localStorageService.set("userToken", res.token);
          loggedIn = true;
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
        loggedIn = false;
			}).error(function(data, status, headers, config) {
				$rootScope.$broadcast('iconsDisplayMessage', {
					type: "alert",
					message: "Oops, something went wrong. Please try again."
				});
			});
		};

    userAPI.getCurrentSessionToken = getCurrentSessionToken;

		userAPI.isAuthenticated = function() {
      return loggedIn;
		};

    userAPI.checkCurrentToken = function() {
      return new Promise(function(resolve, reject) {
        var token = getCurrentSessionToken();
        if (token === null) {
          console.warn('there was no token');
          resolve(false);
        } else {
          $http({
            method: 'POST',
            url: '/auth/token',
            headers: getAccessHeaders()
          }).then(function(res) {
            var valid = (res.data || {}).valid;
            resolve(valid);
          }, function(error) {
            resolve(false);
          })
        }
      });
    };

    userAPI.setTokenValid = function(isValid) {
      if (isValid) {
        loggedIn = true;
      } else {
        localStorageService.remove("userToken");
        loggedIn = false;
      }
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

    var getAccessHeaders = function() {
      return {
        'x-access-token': getCurrentSessionToken(),
      };
    };

    userAPI.getAccessHeaders = getAccessHeaders;

		return userAPI;
}]);

angular.module('icons')
	.controller('uploadController', ["$scope", "$rootScope", "userService", "Upload", "$http", "dataService", "$state", function($scope, $rootScope, userService, Upload, $http, dataService, $state) {

    $scope.icon = {};
    $scope.icon.isUploading = false;

		$scope.submit = function() {
			if ($scope.uploadForm.file.$valid && $scope.file) {
        $rootScope.$broadcast('iconsShowActivityIndicator', true);
        $scope.icon.isUploading = true;
		    $scope.upload($scope.file);
		  }
		};

    $scope.fileChange = function(files, file, newFiles, duplicateFiles, invalidFiles, event) {
      if (file) {
        Upload.base64DataUrl(file).then(function (url) {
          $scope.icon.previewSrc = url;
        });
      }
    };

		// upload on file select or drop
    $scope.upload = function (file) {
      dataService.getSignedUrl(file).then(function (resp) {
        uploadFile(file, resp.data.signedRequest, resp.data.url);
      }, function (err) {
        console.log('Error status: ' + err.status);
        $rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: error.status
      	});
      });
    };

    var uploadFile = function(file, signedRequest, url){
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
          if(xhr.status === 200) {
            saveIcon(url);
          } else {
            $rootScope.$broadcast('iconsDisplayMessage', {
          		type: "alert",
          		message: "Unable to upload file to content server"
          	});
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

      dataService.createIcon(icon).then(function (resp) {
        const savedIcon = resp.data;
        if (savedIcon._id) {
          $state.go('iconDetail', {iconId: savedIcon._id});
        }
      }, function (err) {
        $rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: "Error saving Icon to db."
      	});
      });
    };
  }]);

angular.module('icons')
	.controller('tagsWidgetController', ["$scope", function($scope) {
		console.log('tagsWidgetController loaded');

		
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
    replace: true,
    controller: 'messagesCtrl',
    link: function postLink(scope, element, attrs) {
    	scope.$on('iconsDisplayMessage', function(e,data) {
    		element.append('<div class="'+data.type+' message" icons-message>'+data.message+'</div>');
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

'use strict';

angular.module('icons')
.directive('iconsMessage', ["$timeout", function($timeout) {
	console.log('load');
	return {
    	restrict: 'A',
    	link: function postLink(scope, element, attrs) {
        $timeout(function() {
          element.addClass('show');
        }, 50);
        $timeout(function() {
          element.removeClass('show');
        }, 3000)
    		$timeout(function() {
        	element.remove();
      	}, 3500);
    	}
  	};
}]);

'use strict';

angular.module('icons')
  .controller('MainCtrl', ["$scope", "dataService", function ($scope, dataService) {
    
  }]);

'use strict';

angular.module('icons')
  .controller('loginCtrl', ["$scope", "userService", "$rootScope", function ($scope, userService, $rootScope) {
    $scope.date = new Date();
    $scope.user = {};

    $scope.logIn = function() {
      userService.logIn($scope.user);
    };

    $scope.logOut = function() {
      debugger;
      userService.logOut();
    };

    $scope.validUser = function() {
      return userService.isAuthenticated();
    };

  }]);

'use strict';

angular.module('icons')
.directive('iconsActivityIndicator', function() {
	return {
    	restrict: 'E',
      templateUrl: 'app/loader/loader.directive.html',
      replace: true,
      controller: ["$scope", "$rootScope", function($scope, $rootScope) {
        $scope.isLoading = false;
  			$scope.$on('iconsShowActivityIndicator', function(value) {
          $rootScope.showLoading = !!value;
        });
  		}]
  	};
});

'use strict';

angular.module('icons')
  .controller('iconsListCtrl', ["$scope", "$rootScope", "dataService", "$stateParams", "$http", function ($scope, $rootScope, dataService, $stateParams, $http) {

  	$scope.icons = [];
  	$scope.icon = {};

    console.log($stateParams);
    if ($stateParams.tag) {
      $scope.tag = $stateParams.tag;
      dataService.getIconsWithTag($stateParams.tag).then(function(res) {
        console.warn(res);
        $scope.icons = res.data;
      },function(error) {
        $rootScope.$broadcast('iconsDisplayMessage', {
          type: "alert",
          message: "Oops, something went wrong loading this icon. Please try again."
        });
      });
    } else {
      dataService.getAllIcons().then(function(res) {
        $scope.icons = res.data;
      },function(error) {
      	$rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: "Oops, something went wrong loading this icon. Please try again."
      	});
      });
    }



  }]);

'use strict';

angular.module('icons')
  .controller('iconDetailCtrl', ["$scope", "$rootScope", "$stateParams", "$state", "dataService", function ($scope, $rootScope, $stateParams, $state, dataService) {

  	$scope.icons = [];
  	$scope.icon = {};
    var iconId = $stateParams.iconId;

    if (angular.isDefined(iconId)) {
      dataService.getIcon(iconId).then(function(res) {
        console.log(res.data);
        $scope.icon = res.data;
      }, function(error) {
        $rootScope.$broadcast('iconsDisplayMessage', {
      		type: "alert",
      		message: error.message
      	});
      });
    }

    $scope.delete = function() {
      var r = confirm("Are you sure you want to delete this icon?");
      if (r == true) {
        var deleteIconId = $scope.icon._id
        if (deleteIconId) {
          dataService.deleteIcon(deleteIconId).then(function(res) {
            $rootScope.$broadcast('iconsDisplayMessage', {
          		type: "success",
          		message: "Icon deleted successfully"
          	});
            $state.go('iconList', {});
          }, function(error) {
            $rootScope.$broadcast('iconsDisplayMessage', {
          		type: "alert",
          		message: error.message
          	});
          })
        }
      }
    };


    $scope.edit = function() {
      $scope.editMode = true;
      $scope.icon.newTags = $scope.icon.tags.join(', ');
    }

    $scope.cancel = function() {
      $scope.editMode = false;
    }

    $scope.save = function() {
      dataService.updateIcon($scope.icon).then(function(res) {
        $rootScope.$broadcast('iconsDisplayMessage', {
          type: "success",
          message: "Icon updated"
        });
        $scope.editMode = false;
      }, function(error) {
        $rootScope.$broadcast('iconsDisplayMessage', {
          type: "alert",
          message: error.message
        });
      })
    }

  }]);

angular.module('icons')
	.controller('latestImagesCtrl', ["$scope", "dataService", function($scope, dataService) {

		$scope.icons = [];

    dataService.getAllIcons({limit: 6}).then(function(res) {
      $scope.icons = res.data;
    }, function(error) {
      console.error(error);
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
'use strict';

angular.module('icons')
	.service('dataService', ["$http", "$rootScope", "userService", function($http, $rootScope, userService) {

		var dataAPI = {};

    dataAPI.getIcon = function(iconId) {
      return $http({
        url: '/api/icon/' + iconId,
        method: 'GET',
        headers: userService.getAccessHeaders(),
      });
    };

    dataAPI.createIcon = function(icon) {
      return $http({
        url: '/api/icon',
        method: 'PUT',
        data: icon,
        headers: userService.getAccessHeaders()
      });
    }

    dataAPI.deleteIcon = function(iconId) {
      return $http({
        url: '/api/icon/' + iconId,
        method: 'DELETE',
        headers: userService.getAccessHeaders(),
      });
    };

    dataAPI.updateIcon = function(icon) {
      return $http({
        url: '/api/icon/' + icon._id,
        method: 'POST',
        headers: userService.getAccessHeaders(),
        data: icon
      })
    }

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
  }]);

angular.module("icons").run(["$templateCache", function($templateCache) {$templateCache.put("app/about/about.html","<div class=\"container\"><div class=\"row\"><div class=\"large-12 large-text-center columns\"><h2 class=\"section-heading\">About</h2><h1 class=\"about\">Visionary Images for Social Movements</h1><img class=\"full-width\" src=\"/assets/images/about/IMG_7720.jpg\"><p class=\"image-caption\">Icon Design Workshop, Toronto, 2015</p></div></div><div class=\"row\"><div class=\"large-8 small-12 columns\"><p>Our movements need more images! Social justice organizers have a wide visual vocabulary of protest — raised fists, barbed wire, marchers holding placards — but should we not also depict the world we are building in addition to the forces we’re resisting? How can we communicate concepts we hold dear; concepts like beloved community, allyship, and consent?</p><p>The Vision Archive brings together designers, artists, advocates, and community organizers to co-create images for the world we want to build. Visionarchive.io is like a “Github for visionary social justice images,” allowing users to upload images so other users can download and remix them and upload their new creations.</p><h4 class=\"about\">History</h4><p>The Vision Archive was conceived in 2014 by Una Lee. As a designer working within social movements, she was concerned by some of the trends she was noticing in movement imagery. On the one hand, clipart of raised fists and barbed wire had become visual shorthand for community organizing. On the other hand, some organizations were leaning towards more a more “professional” i.e. bland aesthetic in the hopes of seeming more credible to funders. She worried that these aesthetic directions did not do justice to the visionary work that organizers do.</p><p>Knowing that what we see shapes what we believe is possible, Una felt a need to shift the visual culture of social movements. What if social movement imagery were visionary in addition to being critical? And what if it were created by organizers and community members to reflect the world they are working towards?</p><p>In May 2014, Una led the first “design justice jam” and through a series of participatory activities facilitated 24 activists and artists in the creation of the first set of visionary icons. This was followed by a workshop a year later, for Mayworks 2015. Later that summer, Una teamed up with designer/scholar Gracen Brilmyer, front end developer Jeff Debutte, and backend developer Alex Leitch to build visionarchive.io to house the icons.</p><p>Workshops to date<br>Toronto, Bento Miso, May 2014<br>Toronto, Mayworks, May 2015<br>Brewster, NY, Creative Solutions Symposium, August 2015<br>Berkeley, School of Information, UC Berkeley, March 2016<br>Toronto, Centre for Social Innovation, Regent Park, June 2016</p></div><div class=\"large-4 small-12 columns\"><img src=\"assets/images/about/IMG_3509.jpg\"><p class=\"image-caption\">Building on the icons in the poster design workshop, Toronto, June 2016</p><img src=\"assets/images/about/IMG_0069.JPG\"><p class=\"image-caption\">Collaboration in the poster design workshop, Toronto, June 2016</p></div></div><div class=\"row supported-by\"><div class=\"small-12 columns\"><h4>Supported By</h4></div><div class=\"large-6 small-12 columns\"><img src=\"assets/images/about/CTSP_Logo_2x1.png\"></div><div class=\"large-6 small-12 columns\"><img src=\"assets/images/about/AAT-Logo.png\"></div></div></div>");
$templateCache.put("app/events/latest-event.html","<div class=\"latest-event\"><h3>Latest Event</h3><img ng-src=\"/assets/images/{{event.image}}\" <=\"\" div=\"\"></div>");
$templateCache.put("app/events/upcoming-events.html","<div class=\"upcoming-events\"><h3>Upcoming Events</h3><div ng-repeat=\"event in events\"><h4>{{event.city}}</h4><p class=\"date\">{{event.date}}</p><p class=\"title\">{{event.title}}</p><p class=\"presenters\">{{event.presenters}}</p><p class=\"location\" ng-if=\"event.location\">{{event.location}}</p><p class=\"time\" ng-if=\"event.time\">{{event.time}}</p><a class=\"more\" ng-if=\"event.description\">More</a></div></div>");
$templateCache.put("app/icon/icon-list.html","<div class=\"icons-list\" ng-controller=\"iconsListCtrl\"><div class=\"list-heading row small-up-12\"><h5 ng-if=\"tag\">Icons tagged with: {{tag}}</h5><h5 ng-if=\"!tag\">Icons</h5></div><div class=\"graphics-widget-items row small-up-1 medium-up-3 large-up-4\"><div class=\"column\" ng-repeat=\"icon in icons\"><h4>{{icon.title}}</h4><a ui-sref=\"iconDetail({iconId:icon._id})\"><img class=\"graphic-item\" ng-src=\"{{icon.url}}\" title=\"{{icon.title}}\"></a><p>Tags: <a ng-repeat=\"tag in icon.tags\" ui-sref=\"iconList({tag:tag})\">{{tag}}{{$last ? \'\' : \', \'}}</a></p><p>Location: {{icon.location}}</p><p>Uploaded: {{icon.created | moment : \"MMMM D Y\"}}</p></div></div></div>");
$templateCache.put("app/icon/icon.html","<div class=\"icon\" ng-controller=\"iconDetailCtrl\"><div class=\"row\"><div class=\"large-12 columns\" ng-if=\"icon.isOwnIcon\"><div class=\"icon-functions\"><div ng-if=\"!editMode\" class=\"view-mode fade\"><button class=\"button secondary fade\" ng-click=\"edit()\">Edit</button> <button class=\"button alert fade\" ng-click=\"delete()\">Delete</button></div><div ng-if=\"editMode\" class=\"edit-mode fade\"><button class=\"button secondary fade\" ng-click=\"cancel()\">Cancel</button> <button class=\"button success fade\" ng-click=\"save()\">Save</button></div></div></div><div class=\"large-8 small-12 columns\"><h2 ng-if=\"!editMode\">{{icon.title}}</h2><input ng-if=\"editMode\" type=\"text\" ng-model=\"icon.title\" placeholder=\"Title\"> <img class=\"graphic-item\" ng-src=\"{{icon.url}}\" title=\"{{icon.title}}\"></div><div class=\"large-4 small-12 columns\"><div class=\"detail authors\"><h4>Authors:</h4><p><a ng-repeat=\"author in icon.authors\" ng-href=\"/#/user/{{author._id}}\">{{author.name}}</a></p></div><div class=\"detail added\"><h4>Added:</h4><p>{{icon.created | moment : \"MMMM D Y\"}}</p></div><div class=\"detail location\"><h4>Location:</h4><p ng-if=\"!editMode\">{{icon.location}}</p><input ng-if=\"editMode\" type=\"text\" ng-model=\"icon.location\" placeholder=\"Location\"></div><div class=\"detail story\"><h4>Story:</h4><p ng-if=\"!editMode\">{{icon.story}}</p><input ng-if=\"editMode\" type=\"text\" ng-model=\"icon.story\" placeholder=\"Story\"></div><div class=\"detail tags\"><h4>Tags:</h4><p ng-if=\"!editMode\"><a class=\"tag\" ng-repeat=\"tag in icon.tags\" ui-sref=\"iconList({tag:tag})\">{{tag}}{{$last ? \'\' : \', \'}}</a></p><input ng-if=\"editMode\" type=\"text\" ng-model=\"icon.newTags\" placeholder=\"Title\"></div><div ng-if=\"icon.remixes\" class=\"detail related\"><h4>Remixes:</h4><div class=\"related-icon\" ng-repeat=\"id in icon.remixes\"><h5>{{icons[id].title}}</h5><a ui-sref=\"iconDetail({iconId:id})\"><img class=\"graphic-item\" ng-src=\"/assets/images/{{icons[id].filename}}\" title=\"{{icons[id].title}}\"></a></div></div><div ng-if=\"icon.parent\" class=\"detail related\"><h4>Created With:</h4><div class=\"related-icon\" ng-repeat=\"id in icon.parent\"><h5>{{icons[id].title}}</h5><a href=\"/#/icon?iconId={{id}}\"><img class=\"graphic-item\" ng-src=\"/assets/images/{{icons[id].filename}}\" title=\"{{icons[id].title}}\"></a></div></div></div></div></div>");
$templateCache.put("app/images/latest-images-widget.html","<div class=\"graphics-widget-items\"><div class=\"row small-up-3\"><div class=\"column\" ng-repeat=\"icon in icons\"><a ui-sref=\"iconDetail({iconId:icon._id})\"><img class=\"graphic-item\" ng-src=\"{{icon.url}}\" title=\"{{icon.title}}\"><br>{{icon.title}}</a></div></div></div>");
$templateCache.put("app/loader/loader.directive.html","<div class=\"loader-mask fade\" ng-if=\"showLoading\"><div class=\"loader\"><div class=\"dot\"></div><div class=\"dot\"></div><div class=\"dot\"></div></div></div>");
$templateCache.put("app/login/login.html","<div class=\"row medium-6 medium-centered large-4 large-centered columns\"><form ng-controller=\"loginCtrl\" ng-submit=\"logIn()\"><div class=\"log-in-form\"><h4 class=\"text-center\">Log in</h4><label>Username <input type=\"email\" placeholder=\"Username\" ng-model=\"user.email\" required=\"\"></label> <label>Password <input type=\"password\" placeholder=\"Password\" ng-model=\"user.password\" required=\"\"></label> <button type=\"submit\" class=\"button expand\">Log In</button><p class=\"text-center\"><a ui-sref=\"password\">Forgot your password?</a></p></div></form></div>");
$templateCache.put("app/main/main.html","<div class=\"container\"><div class=\"row\"><div class=\"large-12 large-text-center columns\"><icons-search></icons-search></div></div><div class=\"home-banner row\"><div class=\"large-12 columns\"><div class=\"banner-container\"><img src=\"/assets/images/Banner.png\"><div class=\"pull-up\"><a ui-sref=\"upload\" class=\"button\">Upload An Image</a></div></div></div></div><div class=\"home-animation row\"><div class=\"large-12 columns\"><div class=\"mission-statement-container\"><h2 class=\"center-title\">Visionary Images<br>For Social Movements</h2><img src=\"/assets/images/Home-page-animation.gif\"><div class=\"overlay\"><a ui-sref=\"upload\" class=\"button left\">Upload An Image</a><div class=\"circle\"><a ui-sref=\"something\" class=\"button\">Learn<br>More</a></div><a ui-sref=\"upload\" class=\"button right\">Upload A Remix</a></div></div></div></div><div class=\"row\"><div class=\"small-12 medium-6 columns\"><h3>Latest Images To Remix</h3><icons-latest-images-widget limit=\"6\"></icons-latest-images-widget></div><div class=\"small-12 medium-6 columns\"><h3>Latest Remix</h3><icons-latest-remix></icons-latest-remix></div></div><div class=\"row\"><div class=\"small-12 medium-6 columns\"><icons-upcoming-events limit=\"3\"></icons-upcoming-events></div><div class=\"small-12 medium-6 columns\"><icons-latest-event></icons-latest-event></div></div></div>");
$templateCache.put("app/news/news.html","<div class=\"news\"><h3>Important new announcement goes here</h3></div>");
$templateCache.put("app/navbar/navbar.html","<div class=\"navbar-row\"><div class=\"top-bar-left\"><ul class=\"menu\"><li ui-sref-active=\"active\"><a ui-sref=\"iconList({tag:undefined})\">Icons</a></li><li ui-sref-active=\"active\"><a ui-sref=\"about\">About</a></li><li ng-if=\"validUser()\" ui-sref-active=\"active\"><a ui-sref=\"upload\">Upload</a></li></ul></div><div class=\"top-bar-right\"><ul class=\"menu\"><li ng-if=\"validUser()\"><a href=\"#\" ng-click=\"logOut()\">logout</a></li><li ng-if=\"!validUser()\" ui-sref-active=\"active\" class=\"register\"><a ui-sref=\"register\">Create an account</a></li><li ng-if=\"!validUser()\" ui-sref-active=\"active\"><a ui-sref=\"login\">Login</a></li></ul></div></div>");
$templateCache.put("app/register/register.html","<div class=\"row medium-8 medium-centered large-6 large-centered columns\"><form ng-controller=\"registerCtrl\" ng-submit=\"register()\" data-abide=\"\"><div class=\"register-form\"><h4 class=\"text-center\">Create an account</h4><label>Email <input type=\"email\" placeholder=\"\" ng-model=\"user.email\" required=\"\"></label> <label>Full Name <input type=\"text\" placeholder=\"\" ng-model=\"user.name\" required=\"\"></label><fieldset><legend>Password</legend><label>Choose a Password <input type=\"password\" placeholder=\"Password\" name=\"password\" id=\"password\" ng-model=\"user.password\" required=\"\"></label><div class=\"input-element\"><label>Confirm Password <input type=\"password\" placeholder=\"Confirm Password\" data-equalto=\"password\" required=\"\"></label><div class=\"error\">The passwords do not match</div></div></fieldset><button type=\"submit\" class=\"button expand success\">Create Account</button></div></form></div>");
$templateCache.put("app/remix/latest-remix.html","<div class=\"latest-remix\"><a href=\"/#/icon?iconId={{icon.id}}\"><img class=\"graphic-item\" ng-src=\"/assets/images/{{icon.filename}}\" title=\"{{icon.title}}\"><br>{{icon.title}}</a></div>");
$templateCache.put("app/reset/reset.html","<div class=\"row medium-6 medium-centered large-4 large-centered columns\"><form ng-controller=\"passwordResetCtrl\" ng-submit=\"resetPassword()\" data-abide=\"\"><div class=\"log-in-form\"><h4 class=\"text-center\">Reset your password</h4><p>Enter your email address below if you\'ve lost or forgotten your password. We will send you an email with further instructions</p><label>Email <input type=\"email\" placeholder=\"you@example.com\" ng-model=\"user.username\" required=\"\"></label> <button type=\"submit\" class=\"button expand\">Reset</button></div></form></div>");
$templateCache.put("app/search/search.html","<div class=\"search\"><label>Search:</label> <input type=\"text\" placeholder=\"SEARCH TAGGED IMAGES OF A BETTER WORLD\" class=\"home-search\"></div>");
$templateCache.put("app/stuff/stuff-widget.html","<div class=\"stuff-widget-items\"><ul class=\"small-block-grid-1\"><li ng-repeat=\"thing in stuff\" ng-click=\"gotoStuff(thing.location)\"><div class=\"stuff-item\"></div></li></ul></div>");
$templateCache.put("app/tags/tags-widget.html","<div class=\"tags-widget\"><h3>Popular Tags</h3><div class=\"tags-list\"><a class=\"tag\" ng-repeat=\"tag in tags\" ng-click=\"explore(tag.value)\">{{tag.text}}{{$last ? \'\' : \', \'}}</a></div></div>");
$templateCache.put("app/upload/upload.html","<div class=\"row medium-6 medium-centered large-4 large-centered columns\"><form name=\"uploadForm\" ng-submit=\"submit()\" ng-controller=\"uploadController\"><div class=\"form-item\"><label for=\"title\">Title</label> <input type=\"text\" name=\"title\" ng-model=\"icon.title\" placeholder=\"Title\" required=\"\"></div><div class=\"form-item\"><div class=\"file-picker\" ngf-select=\"\" ngf-drop=\"\" ng-model=\"file\" name=\"file\" ngf-pattern=\"\'image/*\'\" ngf-accept=\"\'image/*\'\" ngf-max-size=\"10MB\" ngf-min-height=\"100\" ngf-min-width=\"100\" ngf-change=\"fileChange($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event)\" ngf-drag-over-class=\"\'file-over\'\" ngf-multiple=\"false\"><img ng-if=\"icon.previewSrc\" ng-src=\"{{icon.previewSrc}}\"><div class=\"instruction\">Select or drop a file<div class=\"allowed-types\">(Allowed types: jpeg, gif, png, svg)</div></div></div></div><div class=\"form-item\"><label for=\"tags\">Location</label> <input type=\"text\" name=\"location\" ng-model=\"icon.location\" placeholder=\"Location\" required=\"\"></div><div class=\"form-item\"><label for=\"tags\">Tags</label> <input type=\"text\" name=\"tags\" ng-model=\"icon.tags\" placeholder=\"Tags (enter comma separated)\"></div><div class=\"form-item\"><label for=\"story\">Story</label> <textarea type=\"text\" name=\"story\" ng-model=\"icon.story\" placeholder=\"Story\"></textarea></div><button class=\"button success round\" type=\"submit\" ng-disabled=\"isUploading\">Upload!</button></form></div>");}]);