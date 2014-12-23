'use strict';

var _ = require('lodash');
var Costumer = require('../costumer/costumer.model');
var moment = require('moment');

function findByHash(hash, callback) {
	Costumer.find({'hash': hash}).exec(function(err, costumers) {
		if (err) {
			callback(err);
		} else {
			if (costumers.length > 0) {
				callback(null, costumers[0]);	
			} else {
				callback(null, null);
			} 
		}
	});
}

// Get list of status
exports.index = function(req, res) {
	findByHash(req.params.hash, function(err, costumer) {
		if (!costumer) {
			return res.status(404).end();		
		}
		if (!costumer.command) {
			return res.status(204).end();
		}
		return res.status(200).send(costumer.command + ', ' + moment(costumer.commandDate).format('DD/MM/YYYY'));
	});
};

exports.create = function(req, res) {
	findByHash(req.params.hash, function(err, costumer){
		if (err) {
			return res.send(500, err);
		}
		if (!costumer || !_.contains(['start', 'stop', 'update'], req.params.cmd)) {
			return res.send(404).end();
		}
		costumer.perform(req.params.cmd);
		costumer.save(function(err){
			if (err) {
				return res.send(500, err);
			}
			return res.status(204).end();
		})
	});
}

exports.update = function(req, res) {
	findByHash(req.params.hash, function(err, costumer) {
		if (costumer.confirm(req.params.version)) {
			costumer.save(function (err) {
		      	if (err) { 
		      		return res.status(204).end();
		      	}
		      	return res.status(204).end();
		    });
		} else {
			res.status(304).end();
		}
	});

}