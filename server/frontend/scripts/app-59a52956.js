"use strict";angular.module("icons",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.router","react","ngFileUpload","LocalStorageModule"]).config(["$stateProvider","$urlRouterProvider","$httpProvider","localStorageServiceProvider",function(e,t,s,o){o.setPrefix("iconsApp"),s.defaults.headers.common={"Content-Type":"application/json"},e.state("home",{url:"/",templateUrl:"app/main/main.html"}).state("login",{url:"/login",templateUrl:"app/login/login.html"}).state("reset",{url:"/reset-password",templateUrl:"app/reset/reset.html"}).state("register",{url:"/register",templateUrl:"app/register/register.html"}).state("upload",{url:"/upload",templateUrl:"app/upload/upload.html"}).state("iconDetail",{url:"/icon?iconId",templateUrl:"app/icon/icon.html"}).state("iconList",{url:"/icons",templateUrl:"app/icon/icon-list.html"}),t.otherwise("/")}]).run(["$rootScope","$state","$document","userService",function(e,t,s,o){var a=["upload"];$(document).foundation(),e.$on("$stateChangeStart",function(e,s){a.indexOf(s.name)>=0&&(o.isAuthenticated()||(e.preventDefault(),t.go("login")))})}]),angular.module("icons").service("userService",["$http","$rootScope","$state","localStorageService",function(e,t,s,o){{var a={},i={headers:{"Content-Type":"application/json"}},n=function(){return o.get("userToken")};n()}return a.logIn=function(a){e.post("/auth/login",a,i).success(function(e){console.log(e),angular.isDefined(e.data.token)?(console.log("user logged in successfully"),o.set("userToken",e.data.token),s.go("upload")):t.$broadcast("iconsDisplayMessage",{type:"alert",message:"Incorrect email or password. Please try again."})}).error(function(){t.$broadcast("iconsDisplayMessage",{type:"alert",message:"Oops, something went wrong. Please try again."})})},a.logOut=function(){e.post("/auth/logout",{},i).success(function(){o.remove("userToken")}).error(function(){t.$broadcast("iconsDisplayMessage",{type:"alert",message:"Oops, something went wrong. Please try again."})})},a.isAuthenticated=function(){return null!==n()},a.register=function(a){e.post("/auth/signup",a,i).success(function(e){console.log(e),angular.isDefined(e.data.token)?(o.set("userToken",e.data.token),s.go("upload"),t.$broadcast("iconsDisplayMessage",{type:"success",message:"Account created successfully."})):t.$broadcast("iconsDisplayMessage",{type:"alert",message:"Oops. An error occured."})}).error(function(){t.$broadcast("iconsDisplayMessage",{type:"alert",message:"Oops, something went wrong. Please try again."})})},a}]),angular.module("icons").controller("tagsWidgetController",["$scope",function(e){console.log("tagsWidgetController loaded"),e.tags=[{text:"pizza party",value:"pizza-party"},{text:"water",value:"water"},{text:"coffee",value:"coffee"},{text:"laptops",value:"laptops"},{text:"community",value:"community"}],e.explore=function(e){console.log("let's see ",e)}}]).directive("iconsTagsWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/tags/tags-widget.html",controller:"tagsWidgetController"}}),angular.module("icons").controller("stuffWidgetController",["$scope",function(e){console.log("stuffWidgetController loaded"),e.stuff=[];for(var t=1;6>=t;t++)e.stuff.push({src:"placeholder://",title:"Placeholder image",location:"path/to/stuff"});e.gotoStuff=function(e){console.log("let's see ",e)}}]).directive("iconsStuffWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/stuff/stuff-widget.html",controller:"stuffWidgetController"}}),angular.module("icons").controller("searchController",["$scope",function(){console.log("searchController loaded")}]).directive("iconsSearch",function(){return{restrict:"E",replace:!0,templateUrl:"app/search/search.html",controller:"searchController"}}),angular.module("icons").controller("passwordResetCtrl",["$scope","userService",function(e){e.date=new Date,e.user={},e.loggedIn=!1}]),angular.module("icons").directive("iconsRemoveSelf",["$timeout",function(e){return{restrict:"A",link:function(t,s){console.log("rmself"),e(function(){s.remove()},3e3)}}}]),angular.module("icons").controller("registerCtrl",["$scope","userService",function(e,t){e.date=new Date,e.user={},e.loggedIn=!1,e.register=function(){console.log(e.user),t.register(e.user)}}]),angular.module("icons").controller("newsController",["$scope",function(){console.log("newsController loaded")}]).directive("iconsNews",function(){return{restrict:"E",replace:!0,templateUrl:"app/news/news.html",controller:"newsController"}}),angular.module("icons").directive("navbar",["$timeout",function(e){return{restrict:"E",templateUrl:"app/navbar/navbar.html",controller:"navbarCtrl",link:function(t,s){e(function(){console.log("hi",s),$(s).foundation()},20)}}}]),angular.module("icons").controller("navbarCtrl",["$scope","userService",function(e,t){e.date=new Date,e.loggedIn=!1,e.logIn=function(){t.logIn(e.user)},e.logOut=function(){t.logOut()},e.validUser=function(){return t.isAuthenticated()}}]),$(document).ready(function(){$("#stickyTopBar").on("sticky.zf.stuckto:top",function(){console.log("stuck!")})}),angular.module("icons").directive("iconsMessages",["$timeout",function(){return{template:'<div class="messages"></div>',restrict:"E",controller:"messagesCtrl",link:function(e,t){e.$on("iconsDisplayMessage",function(e,s){t.append('<div class="hi" icons-remove-self>'+s.message+"</div>")}),e.clear=function(){t.find(".alert-box").remove()}}}}]).controller("messagesCtrl",["$scope","$document",function(e,t){e.close=function(t){console.log(t),e.clear()},e.restartFoundation=function(){$(t).foundation("alert","reflow")}}]),angular.module("icons").controller("MainCtrl",["$scope",function(e){e.awesomeThings=[{title:"AngularJS",url:"https://angularjs.org/",description:"HTML enhanced for web apps!",logo:"angular.png"},{title:"BrowserSync",url:"http://browsersync.io/",description:"Time-saving synchronised browser testing.",logo:"browsersync.png"},{title:"GulpJS",url:"http://gulpjs.com/",description:"The streaming build system.",logo:"gulp.png"},{title:"Jasmine",url:"http://jasmine.github.io/",description:"Behavior-Driven JavaScript.",logo:"jasmine.png"},{title:"Karma",url:"http://karma-runner.github.io/",description:"Spectacular Test Runner for JavaScript.",logo:"karma.png"},{title:"Protractor",url:"https://github.com/angular/protractor",description:"End to end test framework for AngularJS applications built on top of WebDriverJS.",logo:"protractor.png"},{title:"jQuery",url:"http://jquery.com/",description:"jQuery is a fast, small, and feature-rich JavaScript library.",logo:"jquery.jpg"},{title:"Foundation",url:"http://foundation.zurb.com/",description:"The most advanced responsive front-end framework in the world.",logo:"foundation.png"},{title:"Angular Foundation",url:"http://pineconellc.github.io/angular-foundation/",description:"A set of native AngularJS directives based on Foundation's markup and CSS",logo:"angular-foundation.png"},{title:"Sass (Node)",url:"https://github.com/sass/node-sass",description:"Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.",logo:"node-sass.png"},{key:"handlebars",title:"Handlebars",url:"http://handlebarsjs.com/",description:"Handlebars provides the power necessary to let you build semantic templates effectively with no frustration.",logo:"handlebars.png"}],angular.forEach(e.awesomeThings,function(e){e.rank=Math.random()})}]),angular.module("icons").controller("iconDetailCtrl",["$scope","$rootScope","$state","$http",function(e,t,s,o){e.icons=[],e.icon={},o.get("/assets/json/icons.json").success(function(t){e.icons=t,angular.isDefined(s.params.iconId)&&(e.icon=e.icons[parseInt(s.params.iconId)])}).error(function(){t.$broadcast("iconsDisplayMessage",{type:"alert",message:"Oops, something went wrong loading this icon. Please try again."})})}]),angular.module("icons").controller("loginCtrl",["$scope","userService",function(e,t){e.date=new Date,e.user={},e.loggedIn=!1,e.logIn=function(){console.log(e.user),t.logIn(e.user).then(function(){})},e.logOut=function(){t.logOut()},e.validUser=function(){return t.isAuthenticated()}}]),angular.module("icons").controller("graphicsWidgetController",["$scope","$http",function(e,t){console.log("graphicsWidgetController loaded"),e.icons=[],t.get("/assets/json/icons.json").success(function(t){for(var s=0;4>s;s++)e.icons.push(t[s])}).error(function(){$rootScope.$broadcast("iconsDisplayMessage",{type:"alert",message:"Oops, something went wrong loading icons."})})}]).directive("iconsGraphicsWidget",function(){return{restrict:"E",replace:!0,templateUrl:"app/graphics/graphics-widget.html",controller:"graphicsWidgetController"}}),angular.module("icons").run(["$templateCache",function(e){e.put("app/graphics/graphics-widget.html",'<div class="graphics-widget-items"><div class="row small-up-1 medium-up-2 large-up-4"><div class="column" ng-repeat="icon in icons"><a href="/#/icon?iconId={{$index}}"><img class="graphic-item" src="/assets/images/{{icon.filename}}" title="{{icon.title}}"></a></div></div></div>'),e.put("app/icon/icon-list.html",'<div class="icons-list" ng-controller="iconDetailCtrl"><icons-messages></icons-messages><div class="graphics-widget-items row small-up-1 medium-up-3 large-up-4"><div class="column" ng-repeat="icon in icons"><h4>{{icon.title}}</h4><a href="/#/icon?iconId={{$index}}"><img class="graphic-item" src="/assets/images/{{icon.filename}}" title="{{icon.title}}"></a><p>{{icon.location}}, {{icon.date}}</p></div></div></div>'),e.put("app/icon/icon.html",'<div class="icon" ng-controller="iconDetailCtrl"><icons-messages></icons-messages><div class="row"><div class="large-8 small-12 columns"><h2>{{icon.title}}</h2><img class="graphic-item" src="/assets/images/{{icon.filename}}" title="{{icon.title}}"></div><div class="large-4 small-12 columns"><button class="button expand">Download Source</button><div class="detail authors"><h4>Authors:</h4><p>{{icon.author1}} <span ng-if="icon.author2">, {{icon.author2}}</span><span ng-if="icon.author3">, {{icon.author3}}</span></p></div><div class="detail added"><h4>Added:</h4><p>{{icon.date}}</p></div><div class="detail location"><h4>Location:</h4><p>{{icon.location}}</p></div><div class="detail tags"><h4>Tags:</h4><p><a class="tag" ng-repeat="tag in icon.tags" ng-click="explore(tag.value)">{{tag}}{{$last ? \'\' : \', \'}}</a></p></div><div ng-if="icon.related" class="detail related"><h4>Related To:</h4><div class="related-icon" ng-repeat="relatedId in icon.related"><h5>{{icons[relatedId].title}}</h5><a href="/#/icon?iconId={{relatedId}}"><img class="graphic-item" src="/assets/images/{{icons[relatedId].filename}}" title="{{icons[relatedId].title}}"></a></div></div></div><div ng-if="loading" class="loading-indicator"></div></div></div>'),e.put("app/login/login.html",'<div class="row medium-6 medium-centered large-4 large-centered columns"><icons-messages></icons-messages><form ng-controller="loginCtrl" ng-submit="logIn()"><div class="log-in-form"><h4 class="text-center">Log in</h4><label>Username <input type="text" placeholder="Username" ng-model="user.email" required=""></label> <label>Password <input type="password" placeholder="Password" ng-model="user.password" required=""></label> <button type="submit" class="button expand">Log In</button><p class="text-center"><a ui-sref="password">Forgot your password?</a></p></div></form></div>'),e.put("app/main/main.html",'<div class="container"><div class="row"><div class="large-12 large-text-center columns"><icons-search></icons-search></div></div><div class="home-banner row"><div class="large-12 columns"><img src="/assets/images/Banner.png"></div><div class="small-3 small-centered pull-up"><a ui-sref="upload" class="expand button">Upload An Image</a></div></div><div class="home-animation row"><div class="large-12 columns"><img src="/assets/images/Home-page-animation.gif"></div></div><div class="row"><div class="large-12 large-text columns"><div class="tags-feature"><icons-tags-widget></icons-tags-widget></div><icons-news></icons-news></div></div><div class="row"><div><h3>Graphics You\'ve made</h3><icons-graphics-widget></icons-graphics-widget></div></div><div class="row"><div class="large-4 columns"><div><h3>Stuff You\'ve Made</h3><icons-stuff-widget></icons-stuff-widget></div></div></div></div>'),e.put("app/navbar/navbar.html",'<div class="top-bar-left"><ul class="menu"><li ui-sref-active="active"><a ui-sref="iconList">Icons</a></li></ul></div><div class="top-bar-right"><ul class="menu dropdown" data-dropdown-menu=""><li ng-if="validUser()"><a href="#">My Account</a><ul class="menu vertical"><li ui-sref-active="active"><a ui-sref="upload">Upload</a></li><li><a href="#" ng-click="logOut()">logout</a></li></ul></li><li ng-if="!validUser()" ui-sref-active="active" class="register"><a ui-sref="register">Create an account</a></li><li ng-if="!validUser()" ui-sref-active="active"><a ui-sref="login">Login</a></li></ul></div>'),e.put("app/news/news.html",'<div class="news"><h3>Important new announcement goes here</h3></div>'),e.put("app/register/register.html",'<div class="row medium-8 medium-centered large-6 large-centered columns"><icons-messages></icons-messages><form ng-controller="registerCtrl" ng-submit="register()" data-abide=""><div class="register-form"><h4 class="text-center">Create an account</h4><label>Email <input type="email" placeholder="" ng-model="user.email" required=""></label> <label>Full Name <input type="text" placeholder="" ng-model="user.name" required=""></label><fieldset><legend>Password</legend><label>Choose a Password <input type="password" placeholder="Password" name="password" id="password" ng-model="user.password" required=""></label><div class="input-element"><label>Confirm Password <input type="password" placeholder="Confirm Password" data-equalto="password" required=""></label> <small class="error">The passwords do not match</small></div></fieldset><button type="submit" class="button expand success">Create Account</button></div></form></div>'),e.put("app/reset/reset.html",'<div class="row medium-6 medium-centered large-4 large-centered columns"><form ng-controller="passwordResetCtrl" ng-submit="resetPassword()" data-abide=""><div class="log-in-form"><h4 class="text-center">Reset your password</h4><p>Enter your email address below if you\'ve lost or forgotten your password. We will send you an email with further instructions</p><label>Email <input type="email" placeholder="you@example.com" ng-model="user.username" required=""></label> <button type="submit" class="button expand">Reset</button></div></form></div>'),e.put("app/search/search.html",'<div class="search"><label>Search:</label> <input type="text" placeholder="SEARCH TAGGED IMAGES OF A BETTER WORLD" class="home-search"></div>'),e.put("app/stuff/stuff-widget.html",'<div class="stuff-widget-items"><ul class="small-block-grid-1"><li ng-repeat="thing in stuff" ng-click="gotoStuff(thing.location)"><div class="stuff-item"></div></li></ul></div>'),e.put("app/tags/tags-widget.html",'<div class="tags-widget"><h3>Popular Tags</h3><div class="tags-list"><a class="tag" ng-repeat="tag in tags" ng-click="explore(tag.value)">{{tag.text}}{{$last ? \'\' : \', \'}}</a></div></div>')}]);