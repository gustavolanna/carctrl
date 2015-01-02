'use strict';

var _ = require('lodash');
var Costumer = require('../costumer/costumer.model');
var Version = require('../versions/version.model');
var crypto = require("crypto");
var request = require('request');

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

function getLastVersion(callback) {
	Version.find({}).sort('-number').limit(1).exec(function(err, versions){
		if (err) {
			console.log(err);
			callback(err);
		}
		if (versions.length > 0) {
			callback(null, versions[0]);
		} else {
			callback(null, null);
		}
	});
}

exports.index = function(req, res) {
	findByHash(req.params.hash, function(err, costumer) {
		if (!costumer) {
			return res.status(404).end();		
		}
		if (!costumer.command) {
			return res.status(204).end();
		}

		if (costumer.command === 'update') {
			getLastVersion(function(err, version){
				var url = '';

				if (version) {
					request.get(version.url, function(error, response, body){
						console.log(body);						
					});
					url = version.url;
				}

				return res.status(200).send(costumer.command + ',' +  
										    crypto.createHash("md5")
												  .update(costumer.commandDate.toString())
												  .digest("hex") + ', "' +
										    url + '"');
			});
		} else {
				return res.status(200).send(costumer.command + ',' +  crypto
																	  .createHash("md5")
																	  .update(costumer.commandDate.toString())
																	  .digest("hex"));
		}
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
			return res.json(200, costumer).end();
		})
	});
}

exports.update = function(req, res) {
	findByHash(req.params.hash, function(err, costumer) {
		if (costumer.confirm(req.params.cmd, req.params.date, req.params.version)) {
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