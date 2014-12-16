'use strict';

angular.module('carctrlApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Versoes',
      'link': '/versions'
    }, {
      'title': 'Sair',
      'link': '/sair'
    }];

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });