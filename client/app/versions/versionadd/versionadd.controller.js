'use strict';

angular.module('carctrlApp')
    .controller('VersionaddCtrl', function ($scope, $http, $location, FileUploader) {

    $scope.saved = false;

    var uploader = $scope.uploader = new FileUploader({
        url: '/api/files'
    });

    uploader.onAfterAddingFile = function() {
        uploader.uploadAll();
    };

    uploader.onCompleteAll = function() {
        $location.path('/versions');
    };

    $scope.version = {
        descs: [{}]
    };
    $scope.addDesc = function() {
        $scope.version.descs.push({
            desc: '',
            type: ''
        });
    };
    $scope.removeDesc = function(desc) {
        var idx = $scope.version.descs.indexOf(desc);
        $scope.version.descs.splice(idx, 1);
    };
    $scope.showDelBtn = function(desc) {
        var idx = $scope.version.descs.indexOf(desc);
        return idx > 0;
    };
    $scope.save = function() {
        if (!$scope.newDescForm.$valid) {
          return;
        }
        $http.post('/api/versions', $scope.version).success(function() {
            $scope.saved = true;
        });
    };
});
