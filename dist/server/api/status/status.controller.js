'use strict';

var _ = require('lodash');
var Costumer = require('../costumer/costumer.model');

exports.update = function(req, res) {
	Costumer.findByHash(req.params.hash, function(err, costumer){
		if (!costumer) {
			return res.json(404);
		}
		costumer.saveStatus(req.params.status, req.params.user, req.params.version, function(error, user) {
			if (error) {
				return res.json(500);
			}	
			return res.json(200);
		})
	});
};
