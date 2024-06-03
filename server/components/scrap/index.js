'use strict';

let detranmg = require('./detranmg');
let dnit = require('./dnit');

module.exports.scrap = function (vehicle, callback) {
	switch (vehicle.estado) {
		case 'MG': detranmg.scrap(vehicle, callback); break;
		case 'dnit': dnit.scrap(vehicle, callback); break;
	}
}

module.exports.login = function (captcha, opts, vehicle, callback) {
	switch (vehicle.estado) {
		case 'MG': detranmg.login(captcha, opts, vehicle, callback); break;
		case 'dnit': dnit.login(captcha, opts, vehicle, callback); break;
	}
}