var mongoose = require('mongoose'), Schema = mongoose.Schema;

var PlayerSchema = new mongoose.Schema({
	target: {type: Schema.Types.ObjectId, ref:'Player'},
	killer: {type: Schema.Types.ObjectId, ref:'Player'},
	killed: [{type: Schema.Types.ObjectId, ref:'Kill'}],
	isAlive: {type: Boolean, default: true},
	user_id: {type: Schema.Types.ObjectId, required: true, ref:'UserAccount'},
	dateCreated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Player', PlayerSchema);