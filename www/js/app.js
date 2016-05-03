// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'kinvey', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(['$ionicPlatform', '$kinvey', '$rootScope', '$state', 'UserService', function ($ionicPlatform, $kinvey, $rootScope, $state, UserService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $kinvey.init({
      appKey: 'kid_-1euTsyZMb',
      appSecret: 'd51097b0a1bb44c4890af826bf303907'
    });
  
    // Kinvey initialization finished with success
    console.log("Kinvey init with success");
    determineBehavior($kinvey, $state, $rootScope, UserService);

    // setup the stateChange listener
    $rootScope.$on("$stateChangeStart", function (event, toState) {
      if (toState.name !== 'login') {
        determineBehavior($kinvey, $state, $rootScope,UserService);
      }
    });

  });
}])

//function selects the desired behavior depending on whether the user is logged or not
function determineBehavior($kinvey, $state, $rootScope, UserService) {
  var activeUser = UserService.activeUser();

  if ((activeUser === null)) {
    $state.go('login');
  } else if (($state.current.name === 'login') && (activeUser !== null)) {
    $state.go('menu.mobileConsole');
  }
}
