'use strict';

angular.module('carctrlApp')
  .controller('VersoesCtrl', function ($scope, $http) {

    $http.get('/api/versions').success(function(versions) {
      $scope.versions = versions;
    });

  });