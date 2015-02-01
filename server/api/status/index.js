'use strict';

var express = require('express');
var controller = require('./status.controller');

var router = express.Router();

router.put('/:hash/:user/:status/:version', controller.update);

module.exports = router;