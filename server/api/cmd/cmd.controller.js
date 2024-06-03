'use strict';

var _ = require('lodash');
var Costumer = require('../costumer/costumer.model');
var crypto = require("crypto");

exports.index = function(req, res) {
	Costumer.findByHash(req.params.hash, function(err, costumer) {
		if (!costumer) {
			return res.status(404).end();		
		}
		costumer.getStatus(function(err, status){
			if (err) {
				return res.json(500);
			}
			if (!status) {
				return res.json(200);
			}
			return res.status(200).end(status);
		});
	});
};

exports.create = function(req, res) {
	Costumer.findByHash(req.params.hash, function(err, costumer){
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
			return res.json(200, costumer).end();
		})
	});
}

exports.update = function(req, res) {
	Costumer.findByHash(req.params.hash, function(err, costumer) {
		if (costumer.confirm(req.params.cmd, req.params.date, req.params.user, req.body.error)) {
			costumer.save(function (err) {
		      	if (err) { 
		      		return res.status(204).end();
		      	}
		      	return res.status(200).end();
		    });
		} else {
			res.status(304).end();
		}
	});
}
