'use strict';

describe('Controller: CostumeraddCtrl', function () {

  // load the controller's module
  beforeEach(module('carctrlApp'));

  var CostumeraddCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CostumeraddCtrl = $controller('CostumeraddCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
