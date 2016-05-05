// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngStorage', 'kinvey', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(['$ionicPlatform', '$kinvey', '$rootScope', '$state', 'UserService', '$localStorage', 'QuickActionService', function ($ionicPlatform, $kinvey, $rootScope, $state, UserService, $localStorage, QuickActionService) {
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

    QuickActionService.configure();

    determineBehavior($kinvey, $state, $rootScope, UserService);

    // setup the stateChange listener
    $rootScope.$on("$stateChangeStart", function (event, toState) {
      if (toState.name !== 'login') { 
        var courseAltered = determineBehavior($kinvey, $state, $rootScope, UserService, toState);

        if (!courseAltered && $rootScope.currentEnv && ['signup', 'menu.mobileConsole', 'logout', 'menu'].indexOf(toState.name) == -1) {
          if (!$localStorage.lastViewedPages) {
            $localStorage.lastViewedPages = [];
          }

          var displayString = '';
          if (toState.name === 'apps') {
            displayString = toState.prettyName;
          }
          else if (toState.name == 'appInformation') {
            displayString = $rootScope.currentApp.name + ' / ' + toState.prettyName;
          }
          else {
            displayString = $rootScope.currentApp.name + ' / ' + $rootScope.currentEnv.name  + ' / ' + toState.prettyName
          }

          var newRecord = {
            state: toState.name,
            environmentId: $rootScope.currentEnv.id,
            appId: $rootScope.currentApp.id,
            displayString: displayString
          };

          var addNewRecord = true;
          for (var i=0; i < $localStorage.lastViewedPages.length; i++) {
            if ($localStorage.lastViewedPages.displayString == newRecord.displayString) {
              addNewRecord = false;
              break
            }
          }

          if (addNewRecord) {
            $localStorage.lastViewedPages.push(newRecord);

            // Only keep the last four pages.
            if ($localStorage.lastViewedPages.length > 4) {
              $localStorage.lastViewedPages.shift();
            }
          }

          
          QuickActionService.configure();
        }
      }
    });

  });
}])

//function selects the desired behavior depending on whether the user is logged or not
function determineBehavior($kinvey, $state, $rootScope, UserService, toState) {
  var activeUser = UserService.activeUser();

  if ((activeUser === null)) {
    $state.go('login');
  } else if (($state.current.name === 'login') && (activeUser !== null) && (!toState || (toState.name !== 'menu.mobileConsole'))) {
    $state.go('menu.mobileConsole');
  } else {
    return false;
  }
  return true;
}
