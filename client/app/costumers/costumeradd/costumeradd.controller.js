'use strict';

angular.module('carctrlApp')
	.controller('CostumeraddCtrl', function ($scope, $http, $location) {
		$scope.costumer = {};
		$scope.save = function() {
	        if (!$scope.newCostumerForm.$valid) {
	          return;
	        }
	        $http.post('/api/costumers', $scope.costumer).success(function() {
	            $location.path('/costumers');
	        });
		};
	});
