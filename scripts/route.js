spApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/stupidphone/');

    $stateProvider

        .state('user', {
        url: '/stupidphone',
        templateUrl: 'pages/user/user-index.html',
        controller: 'mainController'
    })

    .state('user.home', {
        url: '/',
        templateUrl: 'pages/user/home.html',
        controller: 'homeController'
    })

    .state('user.detail', {
        url: '/detail/:name-:id',
        templateUrl: 'pages/user/detail.html',
        controller: 'productDetailController'
    })

    .state('user.groupProductByBrand', {
        url: '/mobile/:brandName',
        templateUrl: 'pages/user/group-product.html',
        controller: 'groupProductController'
    })

    .state('user.topProduct', {
        url: '/top/:type',
        templateUrl: 'pages/user/group-product.html',
        controller: 'topProductController'
    })

    .state('user.cart', {
        url: '/cart',
        templateUrl: 'pages/user/cart.html'
    })

    .state('user.customerInfo', {
        url: '/info',
        templateUrl: 'pages/user/customer-info.html'
    })

    .state('admin', {
        url: '/admin.stupidphone',
        templateUrl: 'pages/admin/admin-index.html',
        requiresAuthentication: true,
        permissions: ["admin", "super-admin"],
        controller: 'mainController'
    })

    .state('admin.home', {
        url: '/',
        templateUrl: 'pages/admin/home.html',
        requiresAuthentication: true,
        permissions: ["admin", "super-admin"]
    })

    .state('admin.product', {
        url: '/product',
        templateUrl: 'pages/admin/product.html',
        requiresAuthentication: true,
        permissions: ["admin", "super-admin"],
        controller: 'adminProductController'
    });
}]);