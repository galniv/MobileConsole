angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $kinveyProvider) {


  $kinveyProvider.init({
    appKey: 'kid_-1euTsyZMb',
    appSecret: 'd51097b0a1bb44c4890af826bf303907'
  });

  // Kinvey initialization finished with success
  console.log("Kinvey init with success");

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
   
  .state('apps', {
    prettyName: 'Apps',
    url: '/apps',
    templateUrl: 'templates/apps.html',
    controller: 'appsCtrl'
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('logout', {
    url: '/logout',
    controller: 'logoutCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('menu.users', {
    url: '/users',
    prettyName: 'Users',
    views: {
      'side-menu21': {
        templateUrl: 'templates/users.html',
        controller: 'usersCtrl'
      }
    }
  })

  .state('appInformation', {
    url: '/app',
    prettyName: 'Information',
    cache: false,
    parameters: ['app'],
    templateUrl: 'templates/appInformation.html',
    controller: 'appInformationCtrl',
    params: {
      app: null
    }
  })

  .state('menu.environmentDashboard', {
    url: '/dashboard',
    prettyName: 'Dashboard',
    cache: false,
    views: {
      'side-menu21': {
        templateUrl: 'templates/environmentDashboard.html',
        controller: 'environmentDashboardCtrl'
      }
    }
  })

  .state('menu.environmentSettings', {
    url: '/environment-settings',
    prettyName: 'Settings',
    views: {
      'side-menu21': {
        templateUrl: 'templates/environmentSettings.html',
        controller: 'environmentSettingsCtrl'
      }
    }
  })

  .state('menu.collaboration', {
    url: '/collaboration',
    prettyName: 'Collaboration',
    views: {
      'side-menu21': {
        templateUrl: 'templates/collaboration.html',
        controller: 'collaborationCtrl'
      }
    }
  })

  .state('menu.mobileConsole', {
    url: '/landing',
    cache: false,
    views: {
      'side-menu21': {
        templateUrl: 'templates/mobileConsole.html',
        controller: 'mobileConsoleCtrl'
      }
    }
  })

$urlRouterProvider.otherwise("/login")

  

});