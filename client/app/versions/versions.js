'use strict';

angular.module('carctrlApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('versoes', {
        url: '/versions',
        templateUrl: 'app/versions/versions.html',
        controller: 'VersoesCtrl'
      });
  });