'use strict';

var express = require('express');
var controller = require('./cmd.controller');

var router = express.Router();

router.get('/:hash', controller.index);
router.post('/:hash/:cmd', controller.create);
router.put('/:hash/:cmd/:date/:user', controller.update);

module.exports = router;