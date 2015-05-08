var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    Schema = mongoose.Schema;

var UserAccountSchema = new mongoose.Schema({
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	dateCreated: {type: Date, default: Date.now},
	games: [{type:Schema.Types.ObjectId, ref:'Game'}],
});

UserAccountSchema.pre('save', function(next){ 
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();
 
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	    if (err) return next(err);
	 
	    // hash the password along with our new salt
	    bcrypt.hash(user.password, salt, function(err, hash) {
	        if (err) return next(err);
	        // override the cleartext password with the hashed one
	        user.password = hash;
	        next();
	    });
	});
});

UserAccountSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
	});
};

module.exports = mongoose.model('UserAccount', UserAccountSchema);