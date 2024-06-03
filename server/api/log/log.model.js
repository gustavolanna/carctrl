var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
	hash: String,
	logs: []
});

LogSchema.methods = {

	logMessage: function(message, callback) {
		if (this.logs.length >= 100) {
			this.logs.splice(0, 1);
		}
		this.logs.push(message);
		this.save(function(err, log) {
			if (err) {
				return callback(err);
			}
			return callback(null, log);
		});
	}

}

LogSchema.statics.findByHash =  function(hash, callback) {
	this.find({'hash': hash}).exec(function(err, logs) {
		if (err) {
			callback(err);
		} else {
			if (logs.length > 0) {
				callback(null, logs[0]);	
			} else {
				callback(null, null);
			} 
		}
	});
}

module.exports = mongoose.model('Log', LogSchema);	
