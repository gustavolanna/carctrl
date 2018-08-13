'use strict';

var express = require('express');
var controller = require('./cep.controller');

var router = express.Router();

router.get('/:cep', controller.index);

module.exports = router;