angular.module('app.controllers', [])
  
.controller('appsCtrl', function($scope) {

})
      
.controller('loginCtrl', ['$scope', '$kinvey', "$state", "UserService", function ($scope, $kinvey, $state, UserService) {
      $scope.signIn = function () {
          console.log('Sign-In');

          UserService.login().then(function (response) {
                  //Kinvey login finished with success
                  $scope.submittedError = false;
                  $state.go('tab.dash');
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
   
.controller('mobileConsoleCtrl', function($scope) {

})
 
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
                  $state.go('signin');
              },
              function (error) {
                  //Kinvey logout finished with error
                  alert("Error logout: " + JSON.stringify(error));
              });
      }
  }])
