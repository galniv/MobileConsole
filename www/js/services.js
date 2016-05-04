angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])
.factory('User', function () {
    /**
     * Constructor, with class name
     */
    function User(_data) {
        // Public properties, assigned to the instance ('this')
        this.firstName = _data.firstName;
        this.lastName = _data.lastName;
        this.username = _data.username;
        this.id = _data._id;
    }

    /**
     * Public method, assigned to prototype
     */
    User.prototype.getFullName = function () {
        return this.firstName + ' ' + this.lastName;
    };


    /**
     * Static method, assigned to class
     * Instance ('this') is not available in static context
     */
    User.build = function (data) {
        return new User( data );
    };

    /**
     * Return the constructor function
     */
    return User;
})

.factory('UserService', function ($kinvey, $q, User) {
    var currentUser = null;

    return {
        /**
         *
         * @returns {*}
         */
        activeUser: function () {
            if (currentUser === null) {
                var activeUser = $kinvey.User.getActiveUser();
                if (activeUser !== null) {
                  currentUser = User.build(activeUser);
                }
            }
            return currentUser;
        },
        /**
         *
         * @param {String} _username
         * @param {String} _password
         * @returns {*}
         */
        login: function () {
            if ($kinvey.User.getActiveUser()) {
              console.log("I already have an active user")
              return $q.resolve();
            }

            //Kinvey login starts
            var promise = $kinvey.User.loginWithMIC('http://localhost:8100/landing');

            promise.then(function (response) {
                return User.build(response);
            }, function (error) {
                //Kinvey login finished with error
                console.log("Error login " + error.toString());
            });

            return promise;
        }
    };

})

.factory('QuickActionService', ['$rootScope', '$q', QuickActionService]);

function QuickActionService($rootScope, $q) {

    function check3DTouchAvailability() {
        return $q(function(resolve, reject) {              
            if (window.ThreeDeeTouch) {
                window.ThreeDeeTouch.isAvailable(function (available) {
                    resolve(available);
                });
            } else {
                reject();
            }
        });
    }

    function configure() {
        // Check if 3D Touch is supported on the device
        check3DTouchAvailability().then(function(available) {

                if (available) {    // Comment out this check if testing in simulator

                    // Configure Quick Actions
                    window.ThreeDeeTouch.configureQuickActions([
                        {
                            type: 'newNote',
                            title: 'New Note',
                            subtitle: '',
                            iconType: 'compose'
                        }
                    ]);

                    // Set event handler to check which Quick Action was pressed
                    window.ThreeDeeTouch.onHomeIconPressed = function(payload) {
                        if (payload.type == 'newNote') {
                            $rootScope.$broadcast('newNoteQuickAction');
                        }
                    };
                }
        })
    }

    return {
        configure: configure
    };
}