'use strict';

angular.module('carctrlApp')
	.controller('VersoesCtrl', function ($scope, $http) {

		$scope.getTypes = function(version) {
			var types = {};
			for (var i = 0; i < version.descs.length; i++) {
				types[version.descs[i].type] = '';
			}
			return Object.keys(types);
		};

		$http.get('/api/versions').success(function(versions) {
			$scope.versions = versions;
		});

	});