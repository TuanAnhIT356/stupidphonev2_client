// CART DETAIL ENTRY
spApp.factory('UserEntry', ['$resource', function($resource) {
    return $resource('http://localhost:8080/stupidphonev2/api/user/:id', { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
}]);

spApp.service('userService', ['$rootScope', '$sessionStorage', 'UserEntry', function($rootScope, $sessionStorage, UserEntry) {
    var self = this;

    this.init = function() {
        $rootScope.userService = self;
    }

    this.saveInfo = function() {
        if ($sessionStorage.currentUser.user.id == null) {
            insert();
        } else {
            update();
        }
    }

    var insert = function() {
        var userEntry = constructUser();
        userEntry.$save(function() {
            console.log('saved');
        });
    }

    var update = function() {
        var userEntry = constructUser();
        userEntry.id = $sessionStorage.currentUser.user.id;
        userEntry.$update(function() {
            console.log('updated');
        });
    }

    var constructUser = function() {
        var userEntry = new UserEntry();
        userEntry.name = $sessionStorage.currentUser.user.name;
        userEntry.address = $sessionStorage.currentUser.user.address;
        userEntry.sex = $sessionStorage.currentUser.user.sex;
        userEntry.phoneNumber = $sessionStorage.currentUser.user.phoneNumber;
        userEntry.birthdate = $sessionStorage.currentUser.user.birthdate;
        userEntry.account = $sessionStorage.currentUser;
        return userEntry;
    }
}]);