'use strict';

angular.module('carctrlApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('costumeradd', {
        url: '/costumeradd',
        templateUrl: 'app/costumers/costumeradd/costumeradd.html',
        controller: 'CostumeraddCtrl'
      });
  });