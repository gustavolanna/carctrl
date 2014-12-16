'use strict';

var _ = require('lodash');

// Get list of costumers
exports.index = function(req, res) {
	res.json([
	{
		name: 'minas',
		info: 'Minas Veículos'
	},
	{
		name: 'autopisca',
		info: 'Auto Pisca'
	},
	{
		name: 'autosport',
		info: 'Auto Sport'
	},
	{
		name: 'carpro',
		info: 'Car Pro'
	}
	].sort(function(cust1, cust2) {
		if (cust1.name === cust2.name) {
			return 0;
		}
		return cust1.name > cust2.name ? 1 : -1;
	}));
};