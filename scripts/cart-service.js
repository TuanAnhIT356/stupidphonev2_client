// CART DETAIL ENTRY
spApp.factory('CartEntry', ['$resource', function($resource) {
    return $resource('http://localhost:8080/stupidphonev2/api/cart/:id', { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
}]);

spApp.service('cartService', ['$rootScope', '$location', '$timeout', '$filter', '$sessionStorage', 'userService', 'CartEntry', 'authService', function($rootScope, $location, $timeout, $filter, $sessionStorage, userService, CartEntry, authService) {
    var self = this;
    this.cart = [];

    this.init = function() {
        if ($sessionStorage.cartService == null) {
            $sessionStorage.cartService = self;
        } else {
            self.cart = $sessionStorage.cartService.cart;
            $sessionStorage.cartService = self;
        }
        $rootScope.cartService = $sessionStorage.cartService;
    };

    this.addItem = function(product, quantum) {
        var tempIndex = -1;
        angular.forEach(self.cart, function(item, index) {
            if (item.product.id === product.id) {
                tempIndex = index;
            }
        });

        if (tempIndex === -1) {
            self.cart.push({
                product: product,
                quantum: quantum
            });
        } else {
            self.cart[tempIndex].quantum += quantum;
        }
    };

    this.deleteItem = function(index) {
        self.cart.splice(index, 1);
    };

    this.clear = function() {
        self.cart = [];
    }

    this.getTotalValue = function() {
        var sum = 0;
        angular.forEach(self.cart, function(item, index) {
            var temp = item.product.price * (100 - item.product.discount) / 100;
            temp -= temp % 1000;
            sum += temp * item.quantum;
        });
        return sum;
    };

    this.getTotalProduct = function() {
        var sum = 0;
        angular.forEach(self.cart, function(item, index) {
            sum += item.quantum;
        });
        return sum;
    };

    this.mergeCart = function(dbCart) {
        angular.forEach(dbCart.listItems, function(item, index) {
            self.addItem(item.product, item.quantum);
        });
    };

    this.saveCart = function() {
        if (!authService.isLoggedIn()) {
            authService.alertAuth();
        } else {
            var cartEntry = constructCart(0, self.cart, 'new');
            cartEntry.$save(function() {
                self.cart = [];
                alert("Lưu giỏ hàng thành công!");
                authService.login($sessionStorage.username, $sessionStorage.password);
            });
        }
    };

    this.confirm = function() {
        var cartEntry = constructCart(0, self.cart, 'new');

        userService.saveInfo();

        cartEntry.$save(function() {
            self.cart = [];

            authService.login($sessionStorage.username, $sessionStorage.password).then(function() {
                var dbCart = $filter('filter')($sessionStorage.currentUser.listCart, { 'status': 'new' })[0];
                var cartEntry = constructCart(0, dbCart.listItems, 'pending');
                cartEntry.$update(function() {
                    self.cart = [];
                    authService.login($sessionStorage.username, $sessionStorage.password);
                });
            });
        });

        $("#sumit-form").modal('hide');
        $timeout(function() {
            // Use timeout to avoid modal show/hide prob
            $location.path('/stupidphone/info');
            alert("Sản phẩm sẽ được giao tới trong thời gian sớm nhất!");
        }, 500);
    };

    var constructCart = function(discount, listCart, status) {
        var cartEntry = new CartEntry();
        var dbCart = $filter('filter')($sessionStorage.currentUser.listCart, { 'status': 'new' })[0];
        if (dbCart != null) {
            cartEntry.id = dbCart.id;
        }
        cartEntry.discount = discount;
        cartEntry.listItems = listCart;
        cartEntry.account = $sessionStorage.currentUser;
        cartEntry.status = status;
        cartEntry.total = self.getTotalValue();
        return cartEntry;
    }
}]);