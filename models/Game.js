var mongoose = require('mongoose'), Schema = mongoose.Schema;

var GameSchema = new mongoose.Schema({
	title: {type: String, required: true, unique: true},
	description: {type: String, required: true},
	players: [{type: Schema.Types.ObjectId, ref:'Player'}],
	admin_id: {type: Schema.Types.ObjectId, ref:'Admin'},
	capacity: {type: Number, required: true},
	dateCreated: {type: Date, default: Date.now},
	start_date: {type: Date, required: true},
	end_date: {type: Date, required: true},
	winners: [{type: Schema.Types.ObjectId, ref:'Player'}],

	//time booleans
	hasStarted: {type: Boolean, default: false},
	isFinished: {type: Boolean, default: false},
});

module.exports = mongoose.model('Game', GameSchema);