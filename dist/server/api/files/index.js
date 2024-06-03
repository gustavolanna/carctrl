'use strict';

var express = require('express');
var controller = require('./files.controller');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();

router.post('/', multipartMiddleware, controller.upload);
router.get('/:id', controller.download);

module.exports = router;