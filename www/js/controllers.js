angular.module('app.controllers', [])
  
.controller('appsCtrl', ['$scope', '$kinvey', function($scope, $kinvey) {
  var appCollection = $kinvey.DataStore.getInstance('apps');

  if (!$scope.apps) {
    console.log('finding apps!');
    // $scope.apps = [{
    //     "name": "MyApp",
    //     "owner": "25980a1bd010462c894afbe2fac9a78e",
    //     "schemaVersion": 2,
    //     "pendingOwner": "test-64148689fa694cf29c5dcefc2a308e3a@kinvey.com",
    //     "environments": [
    //       {
    //         "id": "kid_Z1DpmAlrCg",
    //         "app": "39cc389ef7304e04b777c5d77e07a80a",
    //         "name": "Development",
    //         "appSecret": "7b371b4a7b61454082a08000367344f2",
    //         "masterSecret": "43da143655ad400394231497be55bf10",
    //         "apiVersion": 3,
    //         "numberOfCollaborators": 0,
    //         "numberOfAdmins": 1
    //       },
    //       {
    //         "id": "kid_Ajd9Xkef",
    //         "app": "39cc389ef7304e04b777c5d77e07a80a",
    //         "name": "Production",
    //         "appSecret": "7b371b4a7b61454082a08000367344f2",
    //         "masterSecret": "43da143655ad400394231497be55bf10",
    //         "apiVersion": 3,
    //         "numberOfCollaborators": 0,
    //         "numberOfAdmins": 1
    //       }
    //     ],
    //     "id": "39cc389ef7304e04b777c5d77e07a80a",
    //     "paymentMethod": "9236a358b88f45fd8af86222c32adf24",
    //     "plan": {
    //       "backup": true,
    //       "bl": {
    //         "timeout": 20000
    //       },
    //       "collaborators": true,
    //       "datalinks": true,
    //       "email": true,
    //       "environments": 10,
    //       "level": "enterprise",
    //       "push": true,
    //       "support": {
    //         "debug": true,
    //         "email": true,
    //         "phone": true
    //       }
    //     }
    //   }
    // ];
    // return
    return appCollection.find().then(function(result) {
      // The entities fetched from the cache
      $scope.apps = result.cache;

      // Return the promise for fetching the entities from the backend
      return result.networkPromise;
    }).then(function(entities) {
      // The entites fetched from the backend. Any entities that do not already exist in your cache
      // or contain changes from what is stored in the cache are saved to the cache for
      // furure fetches.
      $scope.apps = $scope.apps.concat(entities);
    }).catch(function(error) {
      console.log("Error fetching apps!", error)
    });
  }
}])

.controller('loginCtrl', ['$scope', '$kinvey', "$state", "UserService", function ($scope, $kinvey, $state, UserService) {
      $scope.signIn = function () {
          console.log('Sign-In');

          UserService.login().then(function (response) {
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
   
.controller('appInformationCtrl', function($scope) {

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
 
.controller('DashCtrl',
  ['$scope', '$kinvey', "$state", function ($scope, $kinvey, $state) {
      $scope.logout = function () {
          console.log("logout");

          //Kinvey logout starts
          var promise = $kinvey.User.logout();
          promise.then(
              function () {
                  //Kinvey logout finished with success
                  console.log("user logout");
                  $kinvey.setActiveUser(null);
                  $state.go('login');
              },
              function (error) {
                  //Kinvey logout finished with error
                  alert("Error logout: " + JSON.stringify(error));
              });
      }
  }])
