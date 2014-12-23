'use strict';
var Costumer = require('./costumer.model');
var _ = require('lodash');

// Get list of costumers
exports.index = function(req, res) {
	Costumer.find({}).sort('name').exec(function(err, costumers){
		if (err) {
			console.log(err);
			res.json(500, err);
		}
		res.json(200, costumers);
	});
};

exports.create = function(req, res) {
	Costumer.create(req.body, function(err, costumer){
		if (err) {
			console.log(err);
			res.json(500);
		}
		res.json(201);
	});
}