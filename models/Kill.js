var mongoose = require('mongoose'), Schema = mongoose.Schema;

var KillSchema = new mongoose.Schema({
	killer: {type: Schema.Types.ObjectId, ref:'Player', required: true},
	target: {type: Schema.Types.ObjectId, ref:'Player', required: true},
	timeOfKill: {type: Date},
	dateCreated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Kill', KillSchema);