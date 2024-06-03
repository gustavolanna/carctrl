'use strict';

var _ = require('lodash');
var Log = require('./log.model');

// Get list of logs
exports.index = function(req, res) {
	Log.findByHash(req.params.hash, function(err, log) {
		if (err) {
			return res.json(500);
		}
		if (!log) {
			return res.json(404);
		}
		return res.json(log);
	});	
}

exports.logMessage = function(req, res) {
	console.log(req.body.message);
	Log.findByHash(req.params.hash, function(err, log) {
		if (err) {
			return res.json(500);
		}
		if (!log) {
			log = new Log({hash: req.params.hash});
		}
		log.logMessage(req.body.message, function(error, log){
			if (error) {
				return res.json(500);
			}
			return res.json(200);
		});
	})
};