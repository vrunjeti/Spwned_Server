var mongoose = require('mongoose'), Schema = mongoose.Schema;

var GameSchema = new mongoose.Schema({
	players: [{type: Schema.Types.ObjectId, ref:'Player'}],
	admin: {type: Schema.Types.ObjectId, ref:'Player', required: true},
	capacity: {type: Number, required: true},
	start_date: {type: Date, required: true},
	end_date: {type: Date, required: true},
	all_kills: [{type: Schema.Types.ObjectId, ref:'Kill'}],
	messages: [{type: Schema.Types.ObjectId, ref:'Message'}],
	dateCreated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Game', GameSchema);