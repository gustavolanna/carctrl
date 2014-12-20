'use strict';

angular.module('carctrlApp')
    .controller('VersionaddCtrl', function ($scope, $http, $location) {
    $scope.version = {
        number: '',
        types: [],
        sql: '',
        descriptions: [{
            description: '',
            type: ''
        }]
    };
    $scope.addDesc = function() {
        $scope.version.descriptions.push({
            description: '',
            type: ''
        });
    };
    $scope.removeDesc = function(desc) {
        var idx = $scope.version.descriptions.indexOf(desc);
        $scope.version.descriptions.splice(idx, 1);
    };
    $scope.showDelBtn = function(desc) {
        var idx = $scope.version.descriptions.indexOf(desc);
        return idx > 0;
    };
    $scope.save = function() {
        if (!$scope.newDescForm.valid) {
          return;
        }
        $http.post('/api/versions', $scope.version).success(function() {
            $location.path('/versions');
        });
    };
});
