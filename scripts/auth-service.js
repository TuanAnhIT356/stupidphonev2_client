spApp.service('authService', ['$rootScope', '$location', '$timeout', '$filter', '$sessionStorage', '$q', '$http', function($rootScope, $location, $timeout, $filter, $sessionStorage, $q, $http) {
    var self = this;

    this.init = function() {
        if ($sessionStorage.currentUser!= null && $sessionStorage.currentUser.user != null)
            $sessionStorage.currentUser.user.birthdate = new Date($sessionStorage.currentUser.user.birthdate);
        $rootScope.currentUser = $sessionStorage.currentUser;
        $rootScope.authService = self;
    }

    this.login = function(username, password) {
        var defer = $q.defer();
        $http.get('http://localhost:8080/stupidphonev2/api/account/login', { params: { username: username, password: password } })
            .then(function(response) {
                    if (response) {
                        $rootScope.authError = '';
                        $sessionStorage.currentUser = response.data;
                        if ($sessionStorage.currentUser.user != null)
                            $sessionStorage.currentUser.user.birthdate = new Date($sessionStorage.currentUser.user.birthdate);
                        $rootScope.currentUser = $sessionStorage.currentUser;

                        // add user's cart to current session cart
                        var dbCart = $filter('filter')($sessionStorage.currentUser.listCart, { 'status': 'new' })[0];
                        if (dbCart != null)
                            $sessionStorage.cartService.mergeCart(dbCart);

                        defer.resolve(response);
                    } else {
                        defer.reject("Username or password is incorrect");
                    }
                },
                function(error) {
                    defer.reject("Username or password is incorrect");
                });
        return defer.promise;
    };

    this.register = function(username, password) {
        var defer = $q.defer();
        $http.get('http://localhost:8080/stupidphonev2/api/account/register', { params: { username: username, password: password } })
            .then(function(response) {
                defer.resolve(response);
            }, function(error) {
                defer.reject("Error occured");
            });
        return defer.promise;
    };

    this.changePassword = function(username, oldPassword, newPassword) {
        var defer = $q.defer();
        $http.get('http://localhost:8080/stupidphonev2/api/account/change-password', { params: { username: username, oldPassword: oldPassword, newPassword: newPassword } })
            .then(function(response) {
                defer.resolve(response);
            }, function(error) {
                R
                defer.reject("Error occured");
            });
        return defer.promise;
    };

    this.isLoggedIn = function() {
        console.log($sessionStorage.currentUser != null);
        return $sessionStorage.currentUser != null;
    };

    this.logout = function() {
        $sessionStorage.currentUser = null;
        $rootScope.currentUser = null;
        $sessionStorage.cartService.clear();
        $location.path('/');
    };

    this.checkPermissionForView = function(view) {
        // Check if view require authentication or not
        if (!view.requiresAuthentication) {
            return true;
        }

        return userHasPermissionForView(view);
    };

    var userHasPermissionForView = function(view) {
        if (!self.isLoggedIn()) {
            return false;
        }

        // Check if view has permission or not
        if (!view.permissions || !view.permissions.length) {
            return true;
        }

        return userHasPermission(view.permissions);
    };

    // Compare permissions with user roles
    var userHasPermission = function(permissions) {
        var result = false;

        angular.forEach(permissions, function(permission, index) {
            angular.forEach($sessionStorage.currentUser.userRole, function(role, index) {
                if (role.rolename === permission) {
                    result = true;
                    return;
                }
            });
        });

        return result;
    };

    this.alertAuth = function() {
        $rootScope.authError = 'Không đủ quyền truy cập';

        $("#myModal").modal('show');
        $("#login").addClass("in active");
        $("#login-tab").addClass("active");
        $("#reg-tab").removeClass("active");
        $("#reg").removeClass("active");
    };
}]);