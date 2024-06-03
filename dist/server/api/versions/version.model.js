'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VersionSchema = new Schema({
  number: Number,
  release: Date,
  descs: [],
  url: String
});


VersionSchema
  .pre('save', function(next) {
    if (this.isNew) {
    	this.release = new Date();
    }
    next();
  });


module.exports = mongoose.model('Version', VersionSchema);	