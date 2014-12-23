'use strict';

var express = require('express');
var controller = require('./status.controller');

var router = express.Router();

router.get('/:hash', controller.index);
router.post('/:hash/:cmd', controller.create);
router.put('/:hash', controller.update);
router.put('/:hash/:version', controller.update);

module.exports = router;