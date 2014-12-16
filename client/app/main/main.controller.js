'use strict';

angular.module('carctrlApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.costumers = [];

    $http.get('/api/costumers').success(function(costumers) {
      $scope.costumers = costumers;
    });

  });
