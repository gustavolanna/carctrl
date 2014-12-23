'use strict';

describe('Controller: CostumersCtrl', function () {

  // load the controller's module
  beforeEach(module('carctrlApp'));

  var CostumersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CostumersCtrl = $controller('CostumersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
