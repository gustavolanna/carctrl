'use strict';

var express = require('express');
var controller = require('./log.controller');

var router = express.Router();

router.get('/:hash', controller.index);
router.post('/:hash', controller.logMessage);

module.exports = router;