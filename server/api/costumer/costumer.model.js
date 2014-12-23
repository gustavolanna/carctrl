'use strict';

var uuid = require('uuid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CostumerSchema = new Schema({
	name: String,
	version: Number,
	cnpj: String,
	status: String,
	hash: String,
	command: String,
	commandDate: Date,
	lastUpdate: Date
});

CostumerSchema
	.pre('save', function(next){
		if (this.isNew) {
			this.hash = uuid.v1();
			this.calcStatus();
		}
		next();
	});

CostumerSchema.methods = {

	calcStatus: function() {
		if ((this.commandDate && !this.lastUpdate) || (this.commandDate > this.lastUpdate)) {
			this.status = 'waiting';
		} else if (this.commandDate && this.lastUpdate && this.commandDate <= this.lastUpdate){
			if (this.command === 'stop') {
				this.status = 'stoped';
			}
		} else {
			this.status = 'running';
		}
	},

	perform: function(cmd) {
		this.command = cmd;
		this.status = 'waiting';
		this.commandDate = new Date();
	},

	confirm: function(version) {
		if (this.status === 'waiting') {
			this.status = this.command === 'play' ? 'running' : 'stoped';
			this.lastUpdate = new Date();
			if (version) {
				this.version = version;
			}
			return true;
		}
		return false;
	}

}

module.exports = mongoose.model('Costumer', CostumerSchema);	