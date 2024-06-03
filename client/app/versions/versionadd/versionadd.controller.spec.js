'use strict';

describe('Controller: VersionaddCtrl', function () {

  // load the controller's module
  beforeEach(module('carctrlApp'));

  var VersionaddCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VersionaddCtrl = $controller('VersionaddCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
