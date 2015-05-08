var mongoose = require('mongoose'), Schema = mongoose.Schema;

var PlayerSchema = new mongoose.Schema({
	target: {type: Schema.Types.ObjectId, ref:'Player', default: null},
	killer: {type: Schema.Types.ObjectId, ref:'Player', default: null},
	killed: [{type: Schema.Types.ObjectId, ref:'Kill'}],
	isAlive: {type: Boolean, default: true},
	user_id: {type: Schema.Types.ObjectId, required: true, ref:'UserAccount'},
	game_id: {type: Schema.Types.ObjectId, required: true, ref:'Game'},
	dateCreated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Player', PlayerSchema);