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

.controller ('menuCtrl', function($scope, $state, $stateParams, $rootScope, $localStorage, $ionicActionSheet) {
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
        $localStorage.currentEnv = $rootScope.currentEnv;
        return true;
      }
    });
  };

  if($rootScope.currentApp == null) {
    if ($localStorage.currentApp && $localStorage.currentEnv) {
      $rootScope.currentApp = $localStorage.currentApp;
      $rootScope.currentEnv = $localStorage.currentEnv;
    }
    else {
      $state.go('apps');
    }
  }
}) 

.controller('appInformationCtrl', function($scope, $state, $stateParams, $rootScope, $localStorage, $ionicActionSheet) {
  $scope.app = $stateParams.app;

  $scope.onSelectEnvironment = function (environment){
    $rootScope.currentApp = $scope.app;
    $rootScope.currentEnv = environment;
    $localStorage.currentApp = $rootScope.currentApp;
    $localStorage.currentEnv = $rootScope.currentEnv;
    $state.go('menu.environmentDashboard');
  }

  var totalCollaborators = 0;
  for (var i=0; i < $scope.app.environments.length; i++) {
    totalCollaborators += $scope.app.environments[i].numberOfCollaborators;
  }
  $scope.totalCollaborators = totalCollaborators;
})
   
.controller('environmentDashboardCtrl', ['$scope', '$kinvey', function($scope, $kinvey) {
  var analyticsActiveUsers = $kinvey.DataStore.getInstance('analytics-activeusers', $kinvey.DataStoreType.Network);

  var query = new $kinvey.Query();
  query.equalTo('environmentId', $scope.currentEnv.id);

  analyticsActiveUsers.find(query).then(function(response) {
    console.log(response);
  }).catch(function(error){
    console.log(error);
  })
}])
   
.controller('environmentSettingsCtrl', ['$scope', '$http', '$kinvey', '$rootScope', '$localStorage', function($scope, $http, $kinvey, $rootScope, $localStorage) {
  $scope.regenerateAppSecret = function (){
    url = '/environments/' + $rootScope.currentEnv.id + '/regenerate-appsecret';
    return makeKapiRequest($kinvey, $http, $localStorage, $rootScope, 'post', url, {}, true)
  };

  $scope.regenerateMasterSecret = function () {
    url = '/environments/' + $rootScope.currentEnv.id + '/regenerate-mastersecret';
    return makeKapiRequest($kinvey, $http, $localStorage, $rootScope, 'post', url, {}, true)
  };
}])
   
.controller('collaborationCtrl', function($scope) {

})
   
.controller('mobileConsoleCtrl', ['$scope', 'UserService', '$localStorage', function($scope, UserService, $localStorage) {
  $scope.user = UserService.activeUser();
  $scope.lastViewedPages = $localStorage.lastViewedPages || false;

  $scope.navigate = function(pageRecord) {

  };
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

function makeKapiRequest($kinvey, $http, $localStorage, $rootScope, method, path, body, updateEnvironment) {
  var url = 'https://auth.kinvey.com/oauth/validate?access_token=' + $kinvey.User.getActiveUser()._socialIdentity.kinveyAuth.access_token;
  return $http.get(url).then(function(response) {
    var kapiAuth = 'Kinvey ' + response.data.client_token;
    var options = {
      headers: {
        Authorization: kapiAuth
      }
    }
    return $http[method]('https://manage.kinvey.com' + path, body, options).then(function(response) {
      if (updateEnvironment) {
        $localStorage.currentEnv = $rootScope.currentEnv = response.data;

        for (var i=0; i < $rootScope.currentApp.environments.length; i++) {
          if ($rootScope.currentApp.environments[i].id === response.data.id) {
            $rootScope.currentApp.environments[i] = response.data;
            break
          }
        }
      }
    });
  }).catch(function(error) {
    console.log(error);
  });
}