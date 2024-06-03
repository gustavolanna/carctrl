'use strict';

var fs = require('fs');
var async = require('async');
var File = require('./file.model');

exports.upload = function(req, res) {
	var file = req.files.file;
	var fileName = file.path;

	async.waterfall([
		function(callback) {
			var rs = fs.readFile(fileName, function(err, data) {
				if (err) {
					return res.json(500);
				}
				callback(null, data);
			});
		},
		function(data, callback) {
			File.find({name: file.originalFilename}, function(err, file) {
				if (file.length > 0) {
					file = file[0];
					file.content = data;
					file.save(function(err, file) {
						if (err) {
							res.json(500);
						}
						res.json(200);
						fs.unlink(fileName);
					})
				} else {
					callback(null, data);
				}
			});
		},		
		function(data, callback) {
			File.create({
				name: file.originalFilename,
				content: data
			}, function(err, file) {
				if (err) {
					return res.status(500).end();
				}
				res.status(200).end();
				callback();
			});
		},
		function() {
			fs.unlink(fileName);
		}
	]);

};

exports.download = function(req, res) {
	File.find({name: req.params.id}, function(err, file) {
		if (file.length === 0) {
			return res.json(404);
		}
		file = file[0];
		res.set('Content-disposition', 'attachment; filename=' + file.name);
		res.set('Content-type', 'application/octet-stream');
		res.set('Content-length', file.content.length);
		res.end(file.content, 'binary');
	});
}