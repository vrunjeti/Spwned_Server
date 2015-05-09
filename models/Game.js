var mongoose = require('mongoose'), Schema = mongoose.Schema;

var GameSchema = new mongoose.Schema({
	title: {type: String, required: true, unique: true},
	description: {type: String, required: true},
	players: [{type: Schema.Types.ObjectId, ref:'Player'}],
	admin_id: {type: Schema.Types.ObjectId, ref:'Player', required: true},
	capacity: {type: Number, required: true},
	hasStarted: {type: Boolean, default: false},
	all_kills: [{type: Schema.Types.ObjectId, ref:'Kill'}],
	messages: [{type: Schema.Types.ObjectId, ref:'Message'}],
	dateCreated: {type: Date, default: Date.now},
	start_date: {type: Date, required: true},
	end_date: {type: Date, required: true},
	isFinished: {type: Boolean, default: false},
	winners: [{type: Schema.Types.ObjectId, ref:'Player'}],
});

module.exports = mongoose.model('Game', GameSchema);