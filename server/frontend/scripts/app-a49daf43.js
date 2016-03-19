"use strict";angular.module("icons",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","react","ngFileUpload","LocalStorageModule"]).config(["$stateProvider","$urlRouterProvider","$httpProvider","localStorageServiceProvider",function(e,t,o,s){s.setPrefix("iconsApp"),o.defaults.headers.common={"Content-Type":"application/json"},e.state("home",{url:"/",templateUrl:"app/main/main.html"}).state("login",{url:"/login",templateUrl:"app/login/login.html"}).state("reset",{url:"/reset-password",templateUrl:"app/reset/reset.html"}).state("register",{url:"/register",templateUrl:"app/register/register.html"}).state("upload",{url:"/upload",templateUrl:"app/upload/upload.html"}),t.otherwise("/")}]).run(["$rootScope","$state","$document","userService",function(e,t,o,s){var a=["upload"];$(o).foundation(),e.$on("$stateChangeStart",function(e,o){a.indexOf(o.name)>=0&&(s.isAuthenticated()||(e.preventDefault(),t.go("login")))})}]),angular.module("icons").service("userService",["$http","$rootScope","$state","localStorageService",function(e,t,o,s){{var a={},l={headers:{"Content-Type":"application/json"}},r=function(){return s.get("userToken")};r()}return a.logIn=function(a){e.post("http://localhost:8081/auth/login",a,l).then(function(e){console.log(e),angular.isDefined(e.data.token)?(console.log("user logged in successfully"),s.set("userToken",e.data.token),o.go("upload")):t.$broadcast("iconsDisplayMessage",{type:"alert",message:"Incorrect email or password. Please try again."})})},a.logOut=function(){e.post("http://localhost:8081/auth/logout",{},l).then(function(){s.remove("userToken")})},a.isAuthenticated=function(){return null!==r()},a.register=function(a){e.post("http://localhost:8081/auth/signup",a,l).then(function(e){console.log(e),angular.isDefined(e.data.token)?(s.set("userToken",e.data.token),o.go("upload"),t.$broadcast("iconsDisplayMessage",{type:"success",message:"Account created successfully."})):t.$broadcast("iconsDisplayMessage",{type:"alert",message:"Oops. An error occured."})})},a}]),angular.module("icons").controller("uploadController",["$scope","$rootScope","Upload",function(e,t,o){e.submit=function(){e.uploadForm.file.$valid&&e.file&&e.upload(e.file)},e.uploadData={error:!1,success:!1,inProgress:!1},e.upload=function(s){o.upload({url:"upload/upload.py",data:{file:s,username:e.username}}).then(function(e){console.log("Success "+e.config.data.file.name+"uploaded. Response: "+e.data)},function(o){console.log("Error status: "+o.status),t.$broadcast("iconsDisplayMessage",{type:"error",message:"Upload error: "+o.status}),e.uploadData.error=!0},function(t){var o=parseInt(100*t.loaded/t.total);e.upload.complete=o,console.log("progress: "+o+"% "+t.config.data.file.name)})}}]),angular.module("icons").controller("tagsWidgetController",["$scope",function(e){console.log("tagsWidgetController loaded"),e.tags=[{text:"pizza party",value:"pizza-party"},{text:"water",value:"water"},{text:"coffee",value:"coffee"},{text:"laptops",value:"laptops"},{text:"community",value:"community"}],e.explore=function(e){console.log("let's see ",e)}}]).directive("iconsTagsWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/tags/tags-widget.html",controller:"tagsWidgetController"}}),angular.module("icons").controller("stuffWidgetController",["$scope",function(e){console.log("stuffWidgetController loaded"),e.stuff=[];for(var t=1;6>=t;t++)e.stuff.push({src:"placeholder://",title:"Placeholder image",location:"path/to/stuff"});e.gotoStuff=function(e){console.log("let's see ",e)}}]).directive("iconsStuffWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/stuff/stuff-widget.html",controller:"stuffWidgetController"}}),angular.module("icons").controller("searchController",["$scope",function(){console.log("searchController loaded")}]).directive("iconsSearch",function(){return{restrict:"E",replace:!0,templateUrl:"app/search/search.html",controller:"searchController"}}),angular.module("icons").controller("passwordResetCtrl",["$scope","userService",function(e){e.date=new Date,e.user={},e.loggedIn=!1}]),angular.module("icons").controller("registerCtrl",["$scope","userService",function(e,t){e.date=new Date,e.user={},e.loggedIn=!1,e.register=function(){console.log(e.user),t.register(e.user)}}]),angular.module("icons").controller("newsController",["$scope",function(){console.log("newsController loaded")}]).directive("iconsNews",function(){return{restrict:"E",replace:!0,templateUrl:"app/news/news.html",controller:"newsController"}}),angular.module("icons").controller("NavbarCtrl",["$scope","userService",function(e,t){e.date=new Date,e.loggedIn=!1,e.logIn=function(){t.logIn(e.user)},e.logOut=function(){t.logOut()},e.validUser=function(){return t.isAuthenticated()}}]),angular.module("icons").directive("iconsMessages",function(){return{template:'<div class="messages"></div>',restrict:"E",controller:"messagesCtrl",link:function(e,t){e.$on("iconsDisplayMessage",function(o,s){t.append('<div data-alert class="alert-box '+s.type+' radius">'+s.message+'<a class="close" ng-click="close($event">&times;</a></div>'),e.restartFoundation()}),e.clear=function(){t.find(".alert-box").remove()}}}}).controller("messagesCtrl",["$scope","$document",function(e,t){e.close=function(t){console.log(t),e.clear()},e.restartFoundation=function(){$(t).foundation("alert","reflow")}}]),angular.module("icons").controller("MainCtrl",["$scope",function(e){e.awesomeThings=[{title:"AngularJS",url:"https://angularjs.org/",description:"HTML enhanced for web apps!",logo:"angular.png"},{title:"BrowserSync",url:"http://browsersync.io/",description:"Time-saving synchronised browser testing.",logo:"browsersync.png"},{title:"GulpJS",url:"http://gulpjs.com/",description:"The streaming build system.",logo:"gulp.png"},{title:"Jasmine",url:"http://jasmine.github.io/",description:"Behavior-Driven JavaScript.",logo:"jasmine.png"},{title:"Karma",url:"http://karma-runner.github.io/",description:"Spectacular Test Runner for JavaScript.",logo:"karma.png"},{title:"Protractor",url:"https://github.com/angular/protractor",description:"End to end test framework for AngularJS applications built on top of WebDriverJS.",logo:"protractor.png"},{title:"jQuery",url:"http://jquery.com/",description:"jQuery is a fast, small, and feature-rich JavaScript library.",logo:"jquery.jpg"},{title:"Foundation",url:"http://foundation.zurb.com/",description:"The most advanced responsive front-end framework in the world.",logo:"foundation.png"},{title:"Angular Foundation",url:"http://pineconellc.github.io/angular-foundation/",description:"A set of native AngularJS directives based on Foundation's markup and CSS",logo:"angular-foundation.png"},{title:"Sass (Node)",url:"https://github.com/sass/node-sass",description:"Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.",logo:"node-sass.png"},{key:"handlebars",title:"Handlebars",url:"http://handlebarsjs.com/",description:"Handlebars provides the power necessary to let you build semantic templates effectively with no frustration.",logo:"handlebars.png"}],angular.forEach(e.awesomeThings,function(e){e.rank=Math.random()})}]),angular.module("icons").controller("loginCtrl",["$scope","userService",function(e,t){e.date=new Date,e.user={},e.loggedIn=!1,e.logIn=function(){console.log(e.user),t.logIn(e.user).then(function(){})},e.logOut=function(){t.logOut()},e.validUser=function(){return t.isAuthenticated()}}]),angular.module("icons").controller("graphicsWidgetController",["$scope",function(e){console.log("graphicsWidgetController loaded"),e.gotoGraphic=function(e){console.log("let's see ",e)},e.graphics=[{src:"assets/images/Exchange.jpg",title:"title goes here",location:"i/dont/know/what/that/is"},{src:"assets/images/Convergence.jpg",title:"title goes here",location:"i/dont/know/what/that/is"},{src:"assets/images/Harmony.jpg",title:"title goes here",location:"i/dont/know/what/that/is"},{src:"assets/images/CollectiveCare1.jpg",title:"title goes here",location:"i/dont/know/what/that/is"}]}]).directive("iconsGraphicsWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/graphics/graphics-widget.html",controller:"graphicsWidgetController"}}),angular.module("icons").run(["$templateCache",function(e){e.put("app/graphics/graphics-widget.html",'<div class="graphics-widget-items"><ul class="small-block-grid-2 medium-block-grid-3 large-block-grid-4"><li ng-repeat="graphic in graphics" ng-click="gotoGraphic(graphic.location)"><img class="graphic-item" src="{{graphic.src}}" title="{{graphic.title}}"></li></ul></div>'),e.put("app/login/login.html",'<div class="row medium-6 medium-centered large-4 large-centered columns"><icons-messages></icons-messages><form ng-controller="loginCtrl" ng-submit="logIn()"><div class="log-in-form"><h4 class="text-center">Log in</h4><label>Username <input type="text" placeholder="Username" ng-model="user.email" required=""></label> <label>Password <input type="password" placeholder="Password" ng-model="user.password" required=""></label> <button type="submit" class="button expand">Log In</button><p class="text-center"><a ui-sref="password">Forgot your password?</a></p></div></form></div>'),e.put("app/main/main.html",'<div class="row"><div class="large-12 large-text-center columns"><icons-search></icons-search></div></div><div class="row"><div class="large-12 large-text columns"><icons-news></icons-news></div></div><div class="row"><div class="large-12 columns"><div><div class="intro-statement"><h2>This is the intro statement and it is very impressive</h2></div><a ui-sref="upload" class="button radius expand">Upload</a><div class="tags-feature"><icons-tags-widget></icons-tags-widget></div></div></div></div><div class="row"><div><h3>Graphics You\'ve made</h3><icons-graphics-widget></icons-graphics-widget></div></div><div class="row"><div class="large-4 columns"><div><h3>Stuff You\'ve Made</h3><icons-stuff-widget></icons-stuff-widget></div></div></div>'),e.put("app/navbar/navbar.html",'<div class="contain-to-grid sticky"><nav class="top-bar row" data-topbar="" role="navigation" ng-controller="NavbarCtrl"><section class="top-bar-section"><ul class="right"><li ng-if="validUser()" class="has-dropdown"><a href="#">My Account</a><ul class="dropdown"><li><a href="#">First link in dropdown</a></li><li class="active"><a href="#">Active link in dropdown</a></li><li><a href="#" ng-click="logOut()">logout</a></li></ul></li><li ng-if="!validUser()"><a ui-sref="register">Sign-up</a></li><li ng-if="!validUser()"><a ui-sref="login">Login</a></li></ul><ul class="left"><li class="active"><a ui-sref="home">Home</a></li><li><a ng-click="goUpload()">Upload</a></li></ul></section></nav></div>'),e.put("app/news/news.html",'<div class="news"><h3>Important new announcement goes here</h3></div>'),e.put("app/register/register.html",'<div class="row medium-8 medium-centered large-6 large-centered columns"><icons-messages></icons-messages><form ng-controller="registerCtrl" ng-submit="register()" data-abide=""><div class="register-form"><h4 class="text-center">Create an account</h4><label>Email <input type="email" placeholder="" ng-model="user.email" required=""></label> <label>Full Name <input type="text" placeholder="" ng-model="user.name" required=""></label><fieldset><legend>Password</legend><label>Choose a Password <input type="password" placeholder="Password" name="password" id="password" ng-model="user.password" required=""></label><div class="input-element"><label>Confirm Password <input type="password" placeholder="Confirm Password" data-equalto="password" required=""></label> <small class="error">The passwords do not match</small></div></fieldset><button type="submit" class="button expand success">Create Account</button></div></form></div>'),e.put("app/reset/reset.html",'<div class="row medium-6 medium-centered large-4 large-centered columns"><form ng-controller="passwordResetCtrl" ng-submit="resetPassword()" data-abide=""><div class="log-in-form"><h4 class="text-center">Reset your password</h4><p>Enter your email address below if you\'ve lost or forgotten your password. We will send you an email with further instructions</p><label>Email <input type="email" placeholder="you@example.com" ng-model="user.username" required=""></label> <button type="submit" class="button expand">Reset</button></div></form></div>'),e.put("app/search/search.html",'<div class="search"><label>Search:</label> <input type="text" placeholder="Search for something" class="home-search"></div>'),e.put("app/stuff/stuff-widget.html",'<div class="stuff-widget-items"><ul class="small-block-grid-1"><li ng-repeat="thing in stuff" ng-click="gotoStuff(thing.location)"><div class="stuff-item"></div></li></ul></div>'),e.put("app/tags/tags-widget.html",'<div class="tags-widget"><h3>Popular Tags</h3><div class="tags-list"><a class="tag" ng-repeat="tag in tags" ng-click="explore(tag.value)">{{tag.text}}{{$last ? \'\' : \', \'}}</a></div></div>'),e.put("app/upload/upload.html",'<div class="row medium-6 medium-centered large-4 large-centered columns"><icons-messages></icons-messages><form name="uploadForm" ng-submit="submit()" ng-controller="uploadController"><label>Choose a file to upload:<div class="button expand" ngf-select="" ng-model="file" name="file" ngf-pattern="\'image/*\'" ngf-accept="\'image/*\'" ngf-max-size="20MB" ngf-min-height="100" ngf-resize="{width: 100, height: 100}">Select</div></label><div class="submit-button"><button type="submit" class="button success expand">Submit</button></div></form><div ng-if="uploadData.inProgress" class="progress round" ng-class="{error: uploadData.error, success:uploadData.success}"><span class="meter" style="width: {{upload.complete}}%"></span></div></div>')}]);