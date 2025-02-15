/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/detran', require('./api/detran'));
  app.use('/api/logs', require('./api/log'));
  app.use('/api/cmds', require('./api/cmd'));
  app.use('/api/files', require('./api/files'));
  app.use('/api/status', require('./api/status'));
  app.use('/api/versions', require('./api/versions'));
  app.use('/api/costumers', require('./api/costumer'));
  app.use('/api/cep', require('./api/cep'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
