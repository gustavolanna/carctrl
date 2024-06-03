/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Carctrl running on ' + process.env.NODE_ENV + ' mode');

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connection.on('connected', () => console.log("Mongoose default connection is open to ", config.mongo.uri));
mongoose.connection.on('error', err => console.log("Mongoose default connection has occured " + err + " error"));
mongoose.connection.on('disconnected', () => console.log("Mongoose default connection is disconnected"));
process.on('SIGINT', () => {
    mongoose.connection.close(function(){
        console.log("Mongoose default connection is disconnected due to application termination");
        process.exit(0);
    });
});
mongoose.connect(config.mongo.uri, config.mongo.options);

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

process.on('uncaughtException', function (err) {
  console.log(err);
})

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;