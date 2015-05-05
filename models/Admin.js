var mongoose = require('mongoose'), Schema = mongoose.Schema;

var AdminSchema = new mongoose.Schema({
	user_id: {type: Schema.Types.ObjectId, required: true, ref:'UserAccount'},
});

module.exports = mongoose.model('Admin', AdminSchema);