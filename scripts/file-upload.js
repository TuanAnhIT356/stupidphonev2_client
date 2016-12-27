// IMAGE ENTRY
spApp.factory('ImageEntry', ['$resource', function($resource) {
    return $resource('http://localhost:8080/stupidphonev2/api/images/:id', { id: '@id' }, {
        update: {
            method: 'PUT'
        }
    });
}]);

// FILE UPLOAD SERVICE
spApp.service('fileUploadService', ['$http', '$q', 'ImageEntry', function($http, $q, ImageEntry) {
    this.getImagesByProductId = function(productId) {
        var defer = $q.defer();
        $http.get('http://localhost:8080/stupidphonev2/api/images', { params: { productId: productId } }).then(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.uploadFile = function(file, type, productId) {
        var fd = new FormData();
        fd.append('file', file);
        fd.append('type', type);
        fd.append('productId', productId);
        var uploadUrl = 'http://localhost:8080/stupidphonev2/api/images/upload';
        var defer = $q.defer();
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function() {
                defer.resolve();
            })
            .error(function() {
                defer.reject();
            });
        return defer.promise;
    };

    this.downloadFile = function() {
        $http({
                method: 'GET',
                url: 'http://localhost:8080/stupidphonev2/api/images/download',
                params: { fileName: 'Avatar-Anime_zps6c411473.png' },
                responseType: 'arraybuffer'
            })
            .success(function(data, status) {

                console.log(data);
                var file = new Blob([data], { type: 'image/jpg' });
                var fileURL = URL.createObjectURL(file);
                var img = document.createElement('img');
                img.src = fileURL;
                img.target = '_blank';
                document.body.appendChild(img);

            })
            .error(function(data, status) {
                alert('Error ' + status);
            });
    }
}]);