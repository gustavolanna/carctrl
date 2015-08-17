'use strict';

let scraper = require('../../components/scrap');
let logger = require('../../components/log');
let stream = require('stream');
let fs = require('fs');
let map = new Map();
let SESSION_TIMEOUT = (1000 * 60 * 5); // 5min
let CLEAR_INTERVAL = (1000 * 60 * 2); // 2min
let TRIES = 3;

function saveSession(obj) {
	map.set(obj.vehicle.placa, {
		vehicle: obj.vehicle,
		session: obj.opts,
		date: new Date()
	})	
}

function clearSession() {
	logger.info('cleaning session...');
	let date = new Date();
	for (let entry of map.entries()) {
		if ((date - entry[1].date) > SESSION_TIMEOUT) {
			map.delete(entry[0]);
		}
	}
}

function handleResult(req, res) {
	return function (err, obj) {
		if (err) {
			res.status(503).json(err);
		}
		if (obj.file) {
			saveSession(obj);
			res.status(200).download(obj.file, function() {
				fs.unlink(obj.file);
			});
		} else {
			res.status(200).json(obj);
		}		
	}
}

setInterval(clearSession, CLEAR_INTERVAL);

exports.index = function(req, res) {
	logger.info('[%s] Preparing to scrap...', req.params.placa);
	scraper.scrap({
		placa: req.params.placa,
		chassi: req.params.cr,
		renavam: req.params.cr,
		estado: req.params.estado,
		tries: TRIES
	}, handleResult(req, res));
};

exports.retry = function(req, res) {
	logger.info('[%s] Preparing to scrap manually...', req.params.placa);
	if (!map.has(req.params.placa)) {
		logger.error('[%s] object not found on session', req.params.placa);
		return res.send(400)
	}
	logger.error('[%s] restoring object from session', req.params.placa);
	let obj = map.get(req.params.placa);
	map.delete(req.params.placa);
	obj.vehicle.tries = TRIES;
	scraper.login(req.params.captcha, obj.session, obj.vehicle, handleResult(req, res));
};