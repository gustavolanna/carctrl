'use strict';
var Version = require('./version.model');

// Get list of versions
exports.index = function(req, res) {
	Version.find({}).sort('-number').exec(function(err, versions){
		if (err) {
			console.log(err);
			return res.json(500, err);
		}
		res.json(200, versions);
	});
};

exports.create = function(req, res) {
	Version.create(req.body, function(err, version) {
		if (err) {
			console.log(err);
			return res.json(500);
		}
		res.json(201);
	});
};