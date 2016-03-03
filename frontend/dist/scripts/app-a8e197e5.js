"use strict";angular.module("icons",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","mm.foundation","react","ngFileUpload"]).config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"}).state("upload",{url:"/upload",templateUrl:"app/upload/upload.html"}),e.otherwise("/")}]),angular.module("icons").controller("uploadController",["$scope","Upload",function(t,e){t.submit=function(){t.uploadForm.file.$valid&&t.file&&t.upload(t.file)},t.upload=function(o){e.upload({url:"upload/url",data:{file:o,username:t.username}}).then(function(t){console.log("Success "+t.config.data.file.name+"uploaded. Response: "+t.data)},function(t){console.log("Error status: "+t.status)},function(t){var e=parseInt(100*t.loaded/t.total);console.log("progress: "+e+"% "+t.config.data.file.name)})}}]),angular.module("icons").controller("tagsWidgetController",["$scope",function(t){console.log("tagsWidgetController loaded"),t.tags=[{text:"pizza party",value:"pizza-party"},{text:"water",value:"water"},{text:"coffee",value:"coffee"},{text:"laptops",value:"laptops"},{text:"community",value:"community"}],t.explore=function(t){console.log("let's see ",t)}}]).directive("iconsTagsWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/tags/tags-widget.html",controller:"tagsWidgetController"}}),angular.module("icons").controller("stuffWidgetController",["$scope",function(t){console.log("stuffWidgetController loaded"),t.stuff=[];for(var e=1;6>=e;e++)t.stuff.push({src:"placeholder://",title:"Placeholder image",location:"path/to/stuff"});t.gotoStuff=function(t){console.log("let's see ",t)}}]).directive("iconsStuffWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/stuff/stuff-widget.html",controller:"stuffWidgetController"}}),angular.module("icons").controller("searchController",["$scope",function(){console.log("searchController loaded")}]).directive("iconsSearch",function(){return{restrict:"E",replace:!0,templateUrl:"app/search/search.html",controller:"searchController"}}),angular.module("icons").controller("newsController",["$scope",function(){console.log("newsController loaded")}]).directive("iconsNews",function(){return{restrict:"E",replace:!0,templateUrl:"app/news/news.html",controller:"newsController"}}),angular.module("icons").controller("NavbarCtrl",["$scope",function(t){t.date=new Date,t.loggedIn=!1,t.validUser=function(){return t.loggedIn},t.login=function(){t.loggedIn=!0},t.logout=function(){t.loggedIn=!1}}]),angular.module("icons").controller("MainCtrl",["$scope",function(t){t.awesomeThings=[{title:"AngularJS",url:"https://angularjs.org/",description:"HTML enhanced for web apps!",logo:"angular.png"},{title:"BrowserSync",url:"http://browsersync.io/",description:"Time-saving synchronised browser testing.",logo:"browsersync.png"},{title:"GulpJS",url:"http://gulpjs.com/",description:"The streaming build system.",logo:"gulp.png"},{title:"Jasmine",url:"http://jasmine.github.io/",description:"Behavior-Driven JavaScript.",logo:"jasmine.png"},{title:"Karma",url:"http://karma-runner.github.io/",description:"Spectacular Test Runner for JavaScript.",logo:"karma.png"},{title:"Protractor",url:"https://github.com/angular/protractor",description:"End to end test framework for AngularJS applications built on top of WebDriverJS.",logo:"protractor.png"},{title:"jQuery",url:"http://jquery.com/",description:"jQuery is a fast, small, and feature-rich JavaScript library.",logo:"jquery.jpg"},{title:"Foundation",url:"http://foundation.zurb.com/",description:"The most advanced responsive front-end framework in the world.",logo:"foundation.png"},{title:"Angular Foundation",url:"http://pineconellc.github.io/angular-foundation/",description:"A set of native AngularJS directives based on Foundation's markup and CSS",logo:"angular-foundation.png"},{title:"Sass (Node)",url:"https://github.com/sass/node-sass",description:"Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.",logo:"node-sass.png"},{key:"handlebars",title:"Handlebars",url:"http://handlebarsjs.com/",description:"Handlebars provides the power necessary to let you build semantic templates effectively with no frustration.",logo:"handlebars.png"}],angular.forEach(t.awesomeThings,function(t){t.rank=Math.random()})}]),angular.module("icons").controller("graphicsWidgetController",["$scope",function(t){console.log("graphicsWidgetController loaded"),t.gotoGraphic=function(t){console.log("let's see ",t)},t.graphics=[{src:"assets/images/Exchange.jpg",title:"title goes here",location:"i/dont/know/what/that/is"},{src:"assets/images/Convergence.jpg",title:"title goes here",location:"i/dont/know/what/that/is"},{src:"assets/images/Harmony.jpg",title:"title goes here",location:"i/dont/know/what/that/is"},{src:"assets/images/CollectiveCare1.jpg",title:"title goes here",location:"i/dont/know/what/that/is"}]}]).directive("iconsGraphicsWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/graphics/graphics-widget.html",controller:"graphicsWidgetController"}}),angular.module("icons").run(["$templateCache",function(t){t.put("app/graphics/graphics-widget.html",'<div class="graphics-widget-items"><ul class="small-block-grid-2 medium-block-grid-3 large-block-grid-4"><li ng-repeat="graphic in graphics" ng-click="gotoGraphic(graphic.location)"><img class="graphic-item" src="{{graphic.src}}" title="{{graphic.title}}"></li></ul></div>'),t.put("app/main/main.html",'<div class="container"><div ng-include="\'app/navbar/navbar.html\'"></div><div class="row"><div class="large-12 large-text-center columns"><icons-search></icons-search></div></div><div class="row"><div class="large-12 large-text columns"><icons-news></icons-news></div></div><div class="row"><div class="large-4 columns"><div><div class="intro-statement"><h2>This is the intro statement and it is very impressive</h2></div><a href="#/upload" class="button radius expand">Upload</a><div class="tags-feature"><icons-tags-widget></icons-tags-widget></div></div></div></div><div class="row"><div><h3>Graphics You\'ve made</h3><icons-graphics-widget></icons-graphics-widget></div></div><div class="row"><div class="large-4 columns"><div><h3>Stuff You\'ve Made</h3><icons-stuff-widget></icons-stuff-widget></div></div></div></div>'),t.put("app/navbar/navbar.html",'<div class="contain-to-grid sticky"><nav class="top-bar row" data-topbar="" role="navigation" ng-controller="NavbarCtrl"><section class="top-bar-section"><ul class="right"><li ng-if="validUser()" class="has-dropdown"><a href="#">My Account</a><ul class="dropdown"><li><a href="#">First link in dropdown</a></li><li class="active"><a href="#">Active link in dropdown</a></li><li><a href="#" ng-click="logout()">logout</a></li></ul></li><li ng-if="!validUser()"><a ng-href="#">Sign-up</a></li><li ng-if="!validUser()"><a ng-href="#" ng-click="login()">Login</a></li></ul><ul class="left"><li class="active"><a ng-href="#">Home</a></li><li ng-if="validUser()"><a ng-href="#">Upload</a></li><li><a ng-href="#">Explore</a></li><li><a ng-href="#">Community</a></li><li><a ng-href="#">About</a></li><li><a ng-href="#">Search</a></li></ul></section></nav></div>'),t.put("app/news/news.html",'<div class="news"><h3>Important new announcement goes here</h3></div>'),t.put("app/search/search.html",'<div class="search"><label>Search:</label> <input type="text" placeholder="Search for something" class="home-search"></div>'),t.put("app/stuff/stuff-widget.html",'<div class="stuff-widget-items"><ul class="small-block-grid-1"><li ng-repeat="thing in stuff" ng-click="gotoStuff(thing.location)"><div class="stuff-item"></div></li></ul></div>'),t.put("app/tags/tags-widget.html",'<div class="tags-widget"><h3>Popular Tags</h3><div class="tags-list"><a class="tag" ng-repeat="tag in tags" ng-click="explore(tag.value)">{{tag.text}}{{$last ? \'\' : \', \'}}</a></div></div>'),t.put("app/upload/upload.html",'<form name="uploadForm" ng-submit="submit()" ng-controller="uploadController"><div class="button" ngf-select="" ng-model="file" name="file" ngf-pattern="\'image/*\'" ngf-accept="\'image/*\'" ngf-max-size="20MB" ngf-min-height="100" ngf-resize="{width: 100, height: 100}">Select</div><div class="submit-button"><button type="submit">Submit</button></div></form>')}]);