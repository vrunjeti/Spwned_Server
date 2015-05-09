var mongoose = require('mongoose'), Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
	sender_id: {type: Schema.Types.ObjectId, ref:'Player'},
	recipient_id: {type: Schema.Types.ObjectId, ref:'Player', default: null},
	dateCreated: {type: Date, default: Date.now},
	body: {type: String, required: true},
	predecessor: {type: Schema.Types.ObjectId, ref:'Message', default: null},
	game_id: {type: Schema.Types.ObjectId, ref:'Game', required: true}
});

MessageSchema.path('body').validate(function(body) {
	return title.length > 0;
}, 'Message cannot be blank');


module.exports = mongoose.model('Message', MessageSchema);