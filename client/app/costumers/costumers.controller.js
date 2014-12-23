'use strict';

angular.module('carctrlApp')
	.controller('CostumersCtrl', function ($scope, $http) {
		$http.get('/api/costumers').success(function(costumers) {
			$scope.costumers = costumers;
		});
	});
