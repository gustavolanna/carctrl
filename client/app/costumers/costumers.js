'use strict';

angular.module('carctrlApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('costumers', {
        url: '/costumers',
        templateUrl: 'app/costumers/costumers.html',
        controller: 'CostumersCtrl'
      });
  });