'use strict';

angular.module('carctrlApp')
	.controller('CostumersCtrl', function ($scope, $http) {

		$scope.costumers = [];

		function getUrl(hash, cmd) {
			return '/api/status/' + hash + '/' + cmd;
		}

		function updateCostumer(costumer) {
			for (var i = 0; i < $scope.costumers.length; i++) {
				if ($scope.costumers[i].hash === costumer.hash) {
					$scope.costumers[i] = costumer;
				}
			}
		}

		function refresh() {
			$http.get('/api/costumers').success(function(costumers) {
				$scope.costumers = costumers;
			});
		}

		$scope.update = function(hash) {
			$http.post(getUrl(hash, 'update')).success(function(costumer) {
				updateCostumer(costumer);
			});
		};

		$scope.stop = function(hash) {
			$http.post(getUrl(hash, 'stop')).success(function(costumer) {
				updateCostumer(costumer);
			});
		};

		$scope.start = function(hash) {
			$http.post(getUrl(hash, 'start')).success(function(costumer) {
				updateCostumer(costumer);
			});
		};

		refresh();
		setInterval(refresh, 10000);

	});
