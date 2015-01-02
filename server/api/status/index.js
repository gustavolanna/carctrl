'use strict';

var express = require('express');
var controller = require('./status.controller');

var router = express.Router();

router.get('/:hash', controller.index);
router.post('/:hash/:cmd', controller.create);
router.put('/:hash/:cmd/:date', controller.update);
router.put('/:hash/:cmd/:date/:version', controller.update);

module.exports = router;