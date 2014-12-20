'use strict';

var _ = require('lodash');
var memoryStore = [{
		number: '1.152',
		types: ['correção'],
		release: new Date(2014, 11, 1, 10, 59),
		description: ['Testando a versão nao sei o que', 'e nao sei o que mais']
	},
	{
		number: '1.153',
		types: ['correção', 'melhoria'],
		release: new Date(2014, 11, 8, 9, 30),
		description: ['baonvsdn', 'faosdf', 'oasdifmaosmf as']
	},
	{
		number: '1.154',
		types: ['melhoria'],
		release: new Date(2014, 11, 15, 12, 0),
		description: ['aushduahuaheueaheau', 'huah uaeheuahasduif ahsdif', 'anskfnask nfaskdfas asadfihasdkfnaskfjas',  'sdfgsdfgsdgsd22323']
	}];

// Get list of versions
exports.index = function(req, res) {
	res.json(memoryStore.sort(function(v1, v2) {
		if (v1.release === v2.release) {
			return 0;
		}
		return v1.release > v2.release ? -1 : 1;
	}));
};

exports.post = function(req, res) {
	memoryStore.push(req.json);
}