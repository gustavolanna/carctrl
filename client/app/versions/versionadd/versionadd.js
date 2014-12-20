'use strict';

angular.module('carctrlApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('versionadd', {
        url: '/versionadd',
        templateUrl: 'app/versions/versionadd/versionadd.html',
        controller: 'VersionaddCtrl'
      });
  });