'use strict';

describe('Controller: VersoesCtrl', function () {

  // load the controller's module
  beforeEach(module('carctrlApp'));

  var VersoesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VersoesCtrl = $controller('VersoesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
