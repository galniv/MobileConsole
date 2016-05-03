angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('apps', {
    url: '/apps',
    templateUrl: 'templates/apps.html',
    controller: 'appsCtrl'
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.login', {
    url: '/page4',
    views: {
      'side-menu21': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('signup', {
    url: '/page5',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('menu.users', {
    url: '/users',
    views: {
      'side-menu21': {
        templateUrl: 'templates/users.html',
        controller: 'usersCtrl'
      }
    }
  })

  .state('menu.dataLinks', {
    url: '/data-links',
    views: {
      'side-menu21': {
        templateUrl: 'templates/dataLinks.html',
        controller: 'dataLinksCtrl'
      }
    }
  })

  .state('menu.appInformation', {
    url: '/app',
    views: {
      'side-menu21': {
        templateUrl: 'templates/appInformation.html',
        controller: 'appInformationCtrl'
      }
    }
  })

  .state('menu.environmentDashboard', {
    url: '/dashboard',
    views: {
      'side-menu21': {
        templateUrl: 'templates/environmentDashboard.html',
        controller: 'environmentDashboardCtrl'
      }
    }
  })

  .state('menu.environmentSettings', {
    url: '/environment-settings',
    views: {
      'side-menu21': {
        templateUrl: 'templates/environmentSettings.html',
        controller: 'environmentSettingsCtrl'
      }
    }
  })

  .state('menu.collaboration', {
    url: '/collaboration',
    views: {
      'side-menu21': {
        templateUrl: 'templates/collaboration.html',
        controller: 'collaborationCtrl'
      }
    }
  })

  .state('menu.mobileConsole', {
    url: '/landing',
    views: {
      'side-menu21': {
        templateUrl: 'templates/mobileConsole.html',
        controller: 'mobileConsoleCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/side-menu21/page4')

  

});