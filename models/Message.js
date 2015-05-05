var mongoose = require('mongoose'), Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
	sender_id: {type: Schema.Types.ObjectId, ref:'Player'},
	recipient_id: {type: Schema.Types.ObjectId, ref:'Player'},
	dateCreated: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Message', MessageSchema);