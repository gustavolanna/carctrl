'use strict';

var express = require('express');
var controller = require('./versions.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);

module.exports = router;