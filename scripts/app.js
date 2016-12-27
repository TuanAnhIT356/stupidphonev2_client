var spApp = angular.module('spApp', ['ngRoute', 'ui.router', 'ngResource', 'ngStorage', 'ui.scrollpoint']);

spApp.run(['$rootScope', '$location', '$timeout', 'authService', 'cartService', 'userService', 'productService', function($rootScope, $location, $timeout, authService, cartService, userService, productService) {
    authService.init();
    cartService.init();
    userService.init();

    $rootScope.$on('$stateChangeStart', function(event, next) {
        if (next.url === '/stupidphone') {
            event.preventDefault();
            $timeout(function() {
                $location.path('/stupidphone/');
            }, 200);
        } else if (next.url === '/admin.stupidphone') {
            event.preventDefault();
            $timeout(function() {
                $location.path('/admin.stupidphone/');
            }, 200);
        }

        if (!authService.checkPermissionForView(next)) {
            event.preventDefault();
            $timeout(function() {
                $location.path('/stupidphone/');

                // Need to be optimized
                $rootScope.desRoute = '/admin.stupidphone' + next.url;
                authService.alertAuth();
            }, 200);
        }
    });
}]);