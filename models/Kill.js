var mongoose = require('mongoose'), Schema = mongoose.Schema;

var KillSchema = new mongoose.Schema({
	killer_id: {type: Schema.Types.ObjectId, ref:'Player', required: true},
	target_id: {type: Schema.Types.ObjectId, ref:'Player', required: true},
	game_id: {type: Schema.Types.ObjectId, required: true, ref:'Game'},
	timeOfKill: {type: Date, default: Date.now},
	dateCreated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Kill', KillSchema);