'use strict';

var uuid = require('uuid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require("crypto");
var Version = require('../versions/version.model');

var CostumerSchema = new Schema({
	name: String,
	version: Number,
	cnpj: String,
	status: String,
	lastUpdate: Date,
	lastUpdateBy: String,
	hash: String,
	command: String, //stop, update, start
	commandUser: String,
	commandDate: Date,
	commandError: String,
	commandExecuted: Date
});

CostumerSchema
	.pre('save', function(next){
		if (this.isNew) {
			this.hash = uuid.v1();
		}
		next();
	});

CostumerSchema.methods = {

	getLastVersion: function (callback) {
		Version.find({}).sort('-number').limit(1).exec(function(err, versions){
			if (err) {
				callback(err);
			}
			if (versions.length > 0) {
				callback(null, versions[0]);
			} else {
				callback(null, null);
			}
		});
	},

	getCommand: function() {
		if (this.command && this.commandDate && !this.commandExecuted) 
			return  this.command + ',' + crypto.createHash("md5").update(this.commandDate.toString()).digest("hex");
		else
			return '';
	},

	getStatus: function(callback) {
		if (this.commandError) {
			callback(null, null);
		} else if (this.command === 'update') {
			var _this = this;
			this.getLastVersion(function(err, version){
				if (err) {
					return callback(err);
				}				
				if (!version) {
					return callback(null, null);
				}				
				var result = _this.getCommand();
				if (result) {
					result += ', "versao-' + version.number + '.7z",' + version.number;
				}
				return callback(null, result);
			});
		} else {
			callback(null, this.getCommand());
		}
	},

	perform: function(cmd) {
		this.command = cmd;
		this.status = 'waiting';
		this.commandDate = new Date();
		this.commandError = null;
		this.commandExecuted = null;
	},

	confirm: function(cmd, date, user, error) {
		var dateMd5 = crypto.createHash("md5")
							.update(this.commandDate.toString())
							.digest("hex");
		if (error) {
			this.commandError = error;
			this.commandUser = user;
			this.commandExecuted = new Date();
			return true;
		} else if ((!this.commandExecuted) && (this.command === cmd) && (dateMd5 === date)) {
			this.commandUser = user;
			this.commandError = null;
			this.commandExecuted = new Date();
			return true;
		}
		return false;
	},

	saveStatus: function(status, user, version, callback) {
		this.status = status;
		this.lastUpdate = new Date();
		this.lastUpdateBy = user;
		this.version = version;
		this.save(function(error, costumer){
			if (error) {
				return callback(error);
			}
			return callback(null, costumer);
		})
	}
}

CostumerSchema.statics.findByHash =  function(hash, callback) {
	this.find({'hash': hash}).exec(function(err, costumers) {
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


module.exports = mongoose.model('Costumer', CostumerSchema);	
