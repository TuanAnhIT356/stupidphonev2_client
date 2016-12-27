// BRAND SECCTION DIRECTIVE
spApp.directive('brandSection', function() {
    return {
        templateUrl: 'directives/brand-section.html',
        replace: true
    };
});

// BANNER SECTION DIRECTIVE
spApp.directive('bannerSection', function() {
    return {
        templateUrl: 'directives/banner-section.html',
        replace: true
    };
});

// PRODUCT SECTION DIRECTIVE
spApp.directive('productSection', function() {
    return {
        templateUrl: 'directives/product-section.html',
        replace: true,
        scope: {
            className: '@',
            productList: '='
        }
    }
});

// SUBMIT CART MODAL
spApp.directive('submitCartModal', function() {
    return {
        templateUrl: 'directives/submit-cart-modal.html',
        replace: true
    }
});

// ADMIN LAYOUT
spApp.directive('adminLayout', function() {
    return {
        templateUrl: 'directives/admin-layout.html',
        replace: true
    }
});

spApp.directive('userLayout', function() {
    return {
        templateUrl: 'directives/user-layout.html',
        replace: true
    }
});

// CONFIRM WHEN DELETE PRODUCT
spApp.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);


// GET FILE FROM INPUT
spApp.directive('ngFiles', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.ngFiles);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);