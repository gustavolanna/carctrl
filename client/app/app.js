'use strict';

angular.module('carctrlApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'angularFileUpload',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });