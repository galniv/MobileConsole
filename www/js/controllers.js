angular.module('app.controllers', [])

.controller('appsCtrl', ['$scope', '$kinvey', '$state', function($scope, $kinvey, $state) {
  $scope.openAppDetails = function(app) {
    $state.go('menu.appInformation', { app : app });
  };

  var appCollection = $kinvey.DataStore.getInstance('apps');

  $scope.refreshApps = function(skipPullBroadcast) {
    return appCollection.find(null, { useDeltaFetch: false }).then(function(result) {
      // The entities fetched from the cache
      $scope.apps = result.cache;
      $scope.$digest();

      // Return the promise for fetching the entities from the backend
      return result.networkPromise;
    }).then(function(entities) {
      // The entites fetched from the backend. Any entities that do not already exist in your cache
      // or contain changes from what is stored in the cache are saved to the x for
      // furure fetches.
      $scope.apps = entities;
      $scope.$digest();

      if (!skipPullBroadcast) {
        $scope.$broadcast('scroll.refreshComplete');
      }
    }).catch(function(error) {
      console.log("Error fetching apps!", error)
      if (!skipPullBroadcast) {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  if (!$scope.apps) {
    $scope.refreshApps(true);
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

.controller('signupCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {
  $scope.signup = function() {
    var newUser = {
      email: $scope.email,
      password: $scope.password
    }

    $http.post('https://manage.kinvey.com/v2/users', newUser).then(function(response) {
      $scope.gotError = false;
      $state.go('login');
    }).catch(function(errorResponse) {
      var errorBody = errorResponse.data;
      if (errorBody.code !== 'ValidationError' || !errorBody.errors) {
        $scope.errors = [{
          field: errorBody.code,
          message: errorBody.description
        }];
      }
      else {
        $scope.errors = errorBody.errors
      }

      $scope.gotError = true;
    });
  };
}])
   
.controller('usersCtrl', function($scope) {

})
   
.controller('dataLinksCtrl', function($scope) {

})

.controller ('menuCtrl', function($scope, $state, $stateParams, $rootScope, $ionicActionSheet) {
  // Triggered on a button click, or some other target
  $scope.showActionSheet = function() {
    
    var envs = [];
    for (var i=0; i < $rootScope.currentApp.environments.length; i++) {
      envs.push({text: $rootScope.currentApp.environments[i].name});
    }
    var envSelector = $ionicActionSheet.show({
      buttons: envs,
      titleText: 'Select an environment',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        $rootScope.currentEnv = $rootScope.currentApp.environments[index];
        return true;
      }
    });
  };
  if($rootScope.currentApp == null){
    $state.go('apps');
  }


}) 
.controller('appInformationCtrl', function($scope, $stateParams, $rootScope, $ionicActionSheet) {
  $scope.app = $stateParams.app;

  // Triggered on a button click, or some other target
  $scope.showActionSheet = function() {
    
    var envs = [];
    for (var i=0; i < $scope.app.environments.length; i++) {
      envs.push({text: $scope.app.environments[i].name});
    }
    var envSelector = $ionicActionSheet.show({
      buttons: envs,
      titleText: 'Select an environment',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        $scope.selection = $scope.app.environments[index];
        $rootScope.currentApp = $scope.app;
        $rootScope.currentEnv = $scope.selection;
        return true;
      }
    });
  };

  var totalCollaborators = 0;
  for (var i=0; i < $scope.app.environments.length; i++) {
    totalCollaborators += $scope.app.environments[i].numberOfCollaborators;
  }
  $scope.totalCollaborators = totalCollaborators;
})
   
.controller('environmentDashboardCtrl', function($scope) {

})
   
.controller('environmentSettingsCtrl', ['$scope', '$http', '$kinvey', function($scope, $http, $kinvey) {
  $scope.regenerateAppSecret = function (){
    
    var activeUser = $kinvey.User.getActiveUser();

    var req = {
      method: 'POST',
      url: 'https://manage.kinvey.com/environments/' + $scope.currentEnv.id + '/regenerate-appsecret',
      headers: {
        'Authorization': 'Kinvey ' + activeUser.authtoken //WRONG! Needs token for the app being edited
      }
    }
    $http(req).then(function(response){
      console.log(response);
    }, function(error){
      console.log(error);
    })
  };

  $scope.regenerateMasterSecret = function () {
    var activeUser = $kinvey.User.getActiveUser();

    var req = {
      method: 'POST',
      url: 'https://manage.kinvey.com/environments/' + $scope.currentEnv.id + '/regenerate-mastersecret',
      headers: {
        'Authorization': 'Kinvey ' + activeUser.authtoken //WRONG! Needs token for the app being edited
      }
    }
    $http(req).then(function(response){
      console.log(response);
    }, function(error){
      console.log(error);
    })

  };
}])
   
.controller('collaborationCtrl', function($scope) {

})
   
.controller('mobileConsoleCtrl', ['$scope', 'UserService', '$localStorage', function($scope, UserService, $localStorage) {
  $scope.user = UserService.activeUser();
  $scope.lastViewedPages = $localStorage.lastViewedPages || false;
}])
 
.controller('logoutCtrl', ['$scope', '$kinvey', "$state", '$localStorage', function ($scope, $kinvey, $state, $localStorage) {
      console.log("logout");
      $localStorage.lastViewedPages = null;

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
