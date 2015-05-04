var express = require('express');
var mongoose = require('mongoose');

var UserAccount = require('./models/UserAccount');
var Admin = require('./models/Admin');
var Player = require('./models/Player');
var Kill = require('./models/Kill');
var Message = require('./models/Message');
var Game = require('./models/Game');

var bodyParser = require('body-parser');
var router = express.Router();

mongoose.connect('mongodb://alex:duh@ds031632.mongolab.com:31632/spwned_server');
var conn = mongoose.connection;             
conn.on('error', console.error.bind(console, 'connection error:'));  
conn.once('open', function() {
	console.log("√ Mongo Connection");
	// UserAccount.findOne({name: 'jmar777' }, function(err, user) {
 //    if (err) throw err;
 // 	var admin = new Admin({userId:user._id});
 // 	admin.save(function(err) {
 // 		if (err) throw err;
 // 		console.log('success');
 // 	});
 //   });                    
});

var app = express();

var port = process.env.PORT || 4000;

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api', router);

var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
	res.json(jsonBody("Check if mongo has connected","Hello Spwned"));
});

var registerRoute = router.route('/register');

registerRoute.options(function(req, res) {
  res.writeHead(200);
  res.end();
});

function isRegisterValid(req) {
	body = req.body;
	if (body.username=='' || body.username==null || body.password=='' || body.password == null || 
		body.email=='' || body.email == null|| body.firstname == '' || body.firstname == null ||
		body.lastname == '' || body.lastname == null) {
		return false;
	}
	return true;
}

function jsonBody(msg,info) {
	return {message: msg, data: info};
}

registerRoute.post(function(req, res){
	if (!isRegisterValid(req)) {
		res.status(404).json(jsonBody("404 Error","Invalid Input"));
		return;
	}
	newUserAccount = new UserAccount(body);
	newUserAccount.save(function (err) {
	    if(err) {
	   		res.status(404).json({message: "404 Error", data: "Email already exists"});
	    }
	    else {
	    	res.status(201).json({'message':'OK','data':newUserAccount});
	    	UserAccount.findOne({ username: 'niklnarph' }, function(err, user) {
	    		//testing password match - remove soon
    if (err) throw err;
 
    // will delete soon
    user.comparePassword('rippedrinat415', function(err, isMatch) {
        if (err) throw err;
        console.log('Password123:', isMatch); // -&gt; Password123: true
    	});
	});

	    }
	});
});


app.listen(port);
console.log('Server running on port ' + port); 