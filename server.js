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

//API Routes
var homeRoute = router.route('/');
var registerRoute = router.route('/register');
var signinRoute = router.route('/signin');
var gameRoute = router.route('/game');
//API Routes

homeRoute.get(function(req, res) {
	res.json(jsonBody("Check if mongo has connected","Hello Spwned"));
});

function isRegisterValid(req) {
	body = req.body;
	if (body.password=='' || body.password == null || body.email=='' || 
		body.email == null|| body.firstname == '' || body.firstname == null ||
		body.lastname == '' || body.lastname == null) {
		return false;
	}
	return true;
}

function isSignInValid(req) {
	body = req.body;
	if (body.password=='' || body.password == null || body.email=='' || body.email == null) {
		return false;
	}
	return true;
}

function jsonBody(msg,info) {
	return {message: msg, data: info};
}

registerRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

registerRoute.post(function(req, res){
	if (!isRegisterValid(req)) {
		res.status(404).json(jsonBody("404 Error","Invalid Input"));
		return;
	}
	newUserAccount = new UserAccount(body);
	newUserAccount.save(function (err) {
		if(err) {
			res.status(404).json(jsonBody("404 Error","Email Already Exists"));
		}
		else {
			res.status(201).json(jsonBody("register OK",newUserAccount));
		}
	});
});

signinRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

signinRoute.post(function(req, res){
	body = req.body;
	if (!isSignInValid(req)) {
		res.status(404).json(jsonBody("404 Error","Invalid Credentials"));
		return;
	}
	UserAccount.findOne({ email: body.email }, function(err, user) {
		if (err) {
			res.status(404).json(jsonBody("404 Error","Email not in System"));
		}
		else {
			user.comparePassword(body.password, function(err, isMatch) {
				if (err){
					res.status(404).json(jsonBody("404 Error","System Error Please Try Again"));
				}
				else {
	        		if (isMatch) {
	        			res.status(201).json(jsonBody("signin OK",user));
	        		}
	        		else {
						res.status(404).json(jsonBody("404 Error","Invalid Password"));
	        		}
	        	} 
	    	});
		}
	});
});

gameRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

gameRoute.get(function(req, res) {
	req.query.where ? conditions = JSON.parse(req.query.where) : conditions = null;
	req.query.select ? fields = JSON.parse(req.query.select) : fields = null;
  	var options = {
	    sort: null,
	    skip: null,
	    limit: null
  	};
	req.query.sort ? options['sort'] = JSON.parse(req.query.sort) : options['sort']  = null;
	req.query.skip ? options['skip'] = JSON.parse(req.query.skip) : options['skip']  = null;
	req.query.limit ? options['limit'] = JSON.parse(req.query.limit) : options['limit']  = null;

	req.query.count ? countBool = JSON.parse(req.query.count) : countBool  = false;

	if (countBool === true) {	
		Game.count({}, function( err, count){
		    res.status(200).json({message: "OK", data: count}); 
		});	
	}
	else {
		Game.find(conditions, fields, options, function(err, games) {
		    if (err) {
		      res.status(404).json({message: "404 Error", data: err});
		      return;
		    }
		    res.status(200).json({message: "game list OK", data: games}); 
		});	
	}
});

gameRoute.post(function(req, res){
	body = req.body;
	if (false) {
		res.status(404).json(jsonBody("404 Error","Invalid Input"));
		return;
	}
	newGame = new Game(body);
	newGame.save(function (err) {
		if(err) {
			res.status(404).json(jsonBody("404 Error",err));
		}
		else {
			res.status(201).json(jsonBody("game creation OK",newGame));
		}
	});
});


app.listen(port);
console.log('Server running on port ' + port); 