var mongoose = require('mongoose'), Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
	sender_id: {type: Schema.Types.ObjectId, ref:'Player'},
	recipient_id: {type: Schema.Types.ObjectId, ref:'Player', default: null},
	dateCreated: {type: Date, default: Date.now},
	predecessor: {type: Schema.Types.ObjectId, ref:'Message', default: null}
});

module.exports = mongoose.model('Message', MessageSchema);