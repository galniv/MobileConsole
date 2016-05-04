angular.module('app.controllers', [])
  
.controller('appsCtrl', ['$scope', '$kinvey', '$state', function($scope, $kinvey, $state) {
  $scope.openAppDetails = function(app) {
    $state.go('menu.appInformation', { app: app });
  };

  $scope.refreshApps = function(skipPullBroadcast) {
    return appCollection.find(null, { useDeltaFetch: false }).then(function(result) {
      // The entities fetched from the cache
      $scope.apps = result.cache;
      $scope.$digest();

      // Return the promise for fetching the entities from the backend
      return result.networkPromise;
    }).then(function(entities) {
      // The entites fetched from the backend. Any entities that do not already exist in your cache
      // or contain changes from what is stored in the cache are saved to the cache for
      // furure fetches.
      $scope.apps = entities;
      $scope.$digest();

      if (!skipPullBroadcast) {
        $scope.$broadcast('scroll.refreshComplete');
      }
    }).catch(function(error) {
      console.log("Error fetching apps!", error)
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  var appCollection = $kinvey.DataStore.getInstance('apps');

  if (!$scope.apps) {
    $scope.refreshApps(true)
  }
}])

.controller('loginCtrl', ['$scope', '$kinvey', "$state", "UserService", function ($scope, $kinvey, $state, UserService) {
      $scope.signIn = function () {
          console.log('Sign-In');

          UserService.login().then(function (response) {
                console.log("Successful login!")
                  //Kinvey login finished with success
                  $scope.submittedError = false;
                  $state.go('menu.mobileConsole');
              },
              function (error) {
                  //Kinvey login finished with error
                  $scope.submittedError = true;
                  $scope.errorDescription = error.description;
                  console.log("Error login " + error.description);//
              }
          );
          //$state.go('tab.dash');
      };

  }])
   
.controller('signupCtrl', function($scope) {

})
   
.controller('usersCtrl', function($scope) {

})
   
.controller('dataLinksCtrl', function($scope) {

})
   
.controller('appInformationCtrl', function($scope, $stateParams) {
  $scope.app = $stateParams.app;

  var totalCollaborators = 0;
  for (var i=0; i < $scope.app.environments.length; i++) {
    totalCollaborators += $scope.app.environments[i].numberOfCollaborators;
  }
  $scope.totalCollaborators = totalCollaborators;
})
   
.controller('environmentDashboardCtrl', function($scope) {

})
   
.controller('environmentSettingsCtrl', function($scope) {

})
   
.controller('collaborationCtrl', function($scope) {

})
   
.controller('mobileConsoleCtrl', ['$scope', 'UserService', function($scope, UserService) {
  $scope.user = UserService.activeUser();
}])
 
.controller('logoutCtrl',
  ['$scope', '$kinvey', "$state", function ($scope, $kinvey, $state) {
      console.log("logout");

      //Kinvey logout starts
      var activeUser = $kinvey.User.getActiveUser();
      if (!activeUser) {
        console.log("Already logged out!")
        return $state.go('login');
      }

      var promise = activeUser.logout().then(
          function () {
              //Kinvey logout finished with success
              console.log("user logout");
              $state.go('login');
          },
          function (error) {
              //Kinvey logout finished with error
              alert("Error logout: " + JSON.stringify(error));
      });
  }])
