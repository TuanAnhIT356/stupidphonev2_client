// MAIN CONTROLLER
spApp.controller('mainController', ['$scope', '$sessionStorage', '$rootScope', '$location', '$timeout', 'authService', 'productService', function($scope, $sessionStorage, $rootScope, $location, $timeout, authService, productService) {
    $scope.username = '';
    $scope.password = '';
    $scope.confirmPassword = '';
    $scope.oldPassword = '';
    $scope.newPassword = '';
    $scope.$watch('username', function() {
        if (!$scope.username == '')
            $sessionStorage.username = $scope.username;
    });
    $scope.$watch('password', function() {
        if (!$scope.password == '')
            $sessionStorage.password = $scope.password;
    });

    $scope.login = function() {
        authService.login($scope.username, $scope.password).then(function(result) {
            $scope.loginError = '';
            $scope.registerSuccess = '';
            $('#myModal').modal('hide');

            // Try to access restricted route again
            if ($rootScope.desRoute != null) {
                $timeout(function() {
                    // Use timeout to avoid modal show/hide prob
                    $location.path($rootScope.desRoute);
                    $rootScope.authError = '';
                }, 500);
            }
        }, function(error) {
            $scope.loginError = 'Tài khoản hoặc mật khẩu không hợp lệ';
        });
    };

    $scope.register = function() {
        if ($scope.password != $scope.confirmPassword) {
            $scope.registerError = 'Mật khẩu không khớp!';
        } else {
            authService.register($scope.username, $scope.password, $scope.confirmPassword).then(function(result) {
                $scope.registerError = '';
                $scope.registerSuccess = 'Đăng ký thành công! Bạn có thể tiến hành đăng nhập';

                $("#login").addClass("in active");
                $("#login-tab").addClass("active");
                $("#reg-tab").removeClass("active");
                $("#reg").removeClass("active");
            }, function(error) {
                $scope.registerError = 'Tên đăng nhập đã tồn tại';
            });
        }
    };

    $scope.changePassword = function() {
        authService.changePassword($sessionStorage.currentUser.username, $scope.oldPassword, $scope.newPassword).then(function(result) {
            $scope.changePasswordError = '';
            $scope.oldPassword = '';
            $scope.newPassword = '';
            $('#changePassword').modal('hide');
            alert("Đổi mật khẩu thành công")
        }, function(error) {
            $scope.changePasswordError = 'Mật khẩu không hợp lệ';
        });
    };

    $scope.logout = function() {
        authService.logout();
        $scope.username = '';
        $scope.password = '';
        $scope.confirmPassword = '';
    };

    productService.getTopProducts('favorite', 4).then(function(result) {
        $scope.recommendProducts = result.data;
    });
}]);

// HOME CONTROLLER
spApp.controller('homeController', ['$scope', 'productService', function($scope, productService) {
    productService.getTopProducts('favorite', 8).then(function(result) {
        $scope.favoriteProducts = result.data;
    });

    productService.getTopProducts('insert_date', 8).then(function(result) {
        $scope.newProducts = result.data;
    });

    productService.getTopProducts('sold_count', 8).then(function(result) {
        $scope.outsellProducts = result.data;
    });
}]);

// PRODUCT DETAIL CONTROLLER
spApp.controller('productDetailController', ['$scope', '$stateParams', 'productService', '$sessionStorage', function($scope, $stateParams, productService, $sessionStorage) {
    $scope.theProduct = productService.getProductById($stateParams.id);

    $scope.addCart = function() {
        $sessionStorage.cartService.addItem($scope.theProduct, 1);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    };

    $scope.buyItem = function() {
        $sessionStorage.cartService.addItem($scope.theProduct, 1);
    }
}]);

// GROUP PRODUCT CONTROLLER
spApp.controller('groupProductController', ['$scope', '$stateParams', 'productService', function($scope, $stateParams, productService) {
    productService.getProductByBrand($stateParams.brandName).then(function(result) {
        $scope.listProduct = result.data;
    });
}]);


// TOP PRODUCT CONTROLLER
spApp.controller('topProductController', ['$scope', '$stateParams', 'productService', function($scope, $stateParams, productService) {
    var type;
    switch ($stateParams.type) {
        case 'popular':
            type = 'favorite';
            break;
        case 'new':
            type = 'insert_date';
            break;
        case 'outsell':
            type = 'sold_count';
            break;
    }

    productService.getTopProducts(type, -1).then(function(result) {
        $scope.listProduct = result.data;
    });
}]);

// ADMIN PRODUCT CONTROLLER
spApp.controller('adminProductController', ['$scope', 'productService', 'producerService', 'fileUploadService', function($scope, productService, producerService, fileUploadService) {
    $scope.product = {};
    $scope.chosenProduct = {};

    productService.getAllProducts().then(function(result) {
        $scope.listProduct = result;
    });

    producerService.getAllProducers().then(function(result) {
        $scope.listProducer = result;
    });

    $scope.createProduct = function() {
        productService.createProduct($scope.product).then(function(result) {
            $('#createModal').hide();
            $scope.listProduct.push(result)
            $scope.product = {};
        }, function() {
            // handle validation
        });
    }

    $scope.deleteProduct = function(id, index) {
        productService.deleteProduct(id).then(function() {
            $scope.listProduct.splice(index, 1);
        }, function(error) {
            alert('Không thể xóa sản phẩm đang nằm trong hóa đơn');
        });
    };

    $scope.selectProduct = function(index) {
        $scope.tempIndex = index;
        $scope.chosenProduct = {};
        angular.copy($scope.listProduct[index], $scope.chosenProduct);
    };

    $scope.saveDetail = function() {
        productService.updateProduct($scope.chosenProduct).then(function() {
            $scope.listProduct[$scope.tempIndex] = $scope.chosenProduct;
            $('#detailModal').hide();
            $('#editProductModal').hide();
        }, function() {
            // handle validation
        });
    };

    $scope.deleteDetail = function() {
        $scope.chosenProduct.productDetail = {};
    };

    $scope.getImages = function() {
        fileUploadService.getImagesByProductId($scope.chosenProduct.id).then(function(result) {
            $scope.listImage = result.data;
            console.log($scope.listImage);
        });
    }

    $scope.uploadFile = function(type) {
        if ($scope.myFile != null) {
            fileUploadService.uploadFile($scope.myFile, type, $scope.chosenProduct.id).then(function(result) {
                fileUploadService.getImagesByProductId($scope.chosenProduct.id).then(function(result) {
                    $scope.listImage = result.data;
                });
                productService.getAllProducts().then(function(result) {
                    $scope.listProduct = result;
                });
            });

        }
    }
}]);