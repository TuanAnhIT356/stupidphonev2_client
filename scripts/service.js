// PRODUCT ENTRY
spApp.factory('ProductEntry', ['$resource', function($resource) {
    return $resource('http://localhost:8080/stupidphonev2/api/products/:id', { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
}]);

// PRODUCT SERVICE
spApp.service('productService', ['$http', '$q', 'ProductEntry', function($http, $q, ProductEntry) {
    this.getAllProducts = function() {
        var defer = $q.defer();
        var entry = ProductEntry.query(function() {
            defer.resolve(entry);
        });
        return defer.promise;
    };

    this.getTopProducts = function(type, num) {
        var defer = $q.defer();
        $http.get('http://localhost:8080/stupidphonev2/api/products/top', { params: { type: type, num: num } }).then(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getProductById = function(id) {
        return ProductEntry.get({ id: id });
    };

    this.getProductByBrand = function(brandName) {
        var defer = $q.defer();
        $http.get('http://localhost:8080/stupidphonev2/api/products/brand', { params: { brandName: brandName } }).then(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.createProduct = function(product) {
        var defer = $q.defer();
        product.abc = 'abc';
        ProductEntry.save(product, function(result) {
            defer.resolve(result);
        }, function() {
            defer.reject();
        });
        return defer.promise;
    }

    this.updateProduct = function(product) {
        var defer = $q.defer();
        ProductEntry.update(product, function() {
            defer.resolve();
        }, function() {
            defer.reject();
        });
        return defer.promise;
    }

    this.deleteProduct = function(id) {
        var defer = $q.defer();
        var entry = ProductEntry.get({ id: id }, function() {
            entry.$delete(function() {
                defer.resolve();
            }, function() {
                defer.reject();
            });
        });
        return defer.promise;
    };
}]);

// PRODUCER ENTRY
spApp.factory('ProducerEntry', ['$resource', function($resource) {
    return $resource('http://localhost:8080/stupidphonev2/api/producers/:id', { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
}]);

// PRODUCER SERVICE
spApp.service('producerService', ['$http', '$q', 'ProducerEntry', function($http, $q, ProducerEntry) {
    this.getAllProducers = function() {
        var defer = $q.defer();
        var entry = ProducerEntry.query(function() {
            defer.resolve(entry);
        });
        return defer.promise;
    };
}]);