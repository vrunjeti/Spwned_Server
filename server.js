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
var gameIDRoute = router.route('/game/:id');
var gameJoinRoute = router.route('/game/:id/join');
var gameStartRoute = router.route('/game/:id/start');
var playerRoute = router.route('/player');
var playerIDRoute = router.route('/player/:id');
var playerReportRoute = router.route('/player/:id/report');
var messagePIDRoute = router.route('/message/p/:id');
var messageIDRoute = router.route('/message/:id');
//API Routes

homeRoute.get(function(req, res) {
	res.json(jsonBody("Check if mongo has connected","Hello Spwned"));
});

function isRegisterValid(req) {
	body = req.body;
	if (body.password=='' || body.password == null || body.email=='' || 
		body.email == null|| body.first_name == '' || body.first_name == null ||
		body.last_name == '' || body.last_name == null) {
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

function findDuplicateUser(user_id,game) {
	players = game.players;
	for (i = 0; i < players.length; i++) {
		if (players[i].user_id == user_id)
			return false;
	}
	return true;
}

function makeSecretCode()
{
    var secret = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 4; i++ )
        secret += possible.charAt(Math.floor(Math.random() * possible.length));

    return secret;
}

/*AUTHENTICATION */
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

/*GAME */

gameRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

gameRoute.get(function(req, res) {
	req.query.where ? conditions = JSON.parse(req.query.where) : conditions = null;
	req.query.count ? countBool = JSON.parse(req.query.count) : countBool  = false;

	if (countBool === true) {	
		Game.count({}, function( err, count){
		    res.status(200).json({message: "OK", data: count}); 
		});	
	}
	else {
		Game.find(conditions, null, null, function(err, games) {
		    if (err) {
		      res.status(404).json({message: "404 Error", data: err});
		      return;
		    }
		    //console.log(games[0].messages.push(12134));
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

gameIDRoute.get(function(req, res) {
	Game.findById(req.params.id, function(err, target) {
	    if (err || !target) {
	    	res.status(404).json(jsonBody("404 Error","Could not find Game"));
	    	return;
	    }
	    else {
			res.status(200).json(jsonBody('game ID OK',target));
		}
  });
});

gameJoinRoute.put(function(req, res) {
	body = req.body;
	Game.findById(req.params.id, function(err, game) {
	    if (err || !game) {
	    	res.status(404).json({'message':'404 Error','data':'Game ID does not exist'});
	    	return;
	    }
	    else {
	    	if (!findDuplicateUser(body.user_id,game)){
	    		res.status(404).json(jsonBody("404 Error","User is already part of this game"));
	    		return;
	    	}
	    	UserAccount.findById(body.user_id,function(err, user) {
	    		if (err || !user) {
	    			res.status(404).json(jsonBody("404 Error","Could not join. Invalid User"));
	    			return;
	    		}
	    		else {
	    			newPlayer = new Player({user_id:body.user_id,game_id:game._id,secret_code:makeSecretCode()});
	    			game.players.push(mongoose.Types.ObjectId(newPlayer._id));
	    			newPlayer.save();
	    			game.save(function(err) {
	    				if (err) {
			    			res.status(505).json(jsonBody("505 Error",err));
			    		}
	    				else {
	    					user.games.push(mongoose.Types.ObjectId(game._id));
			    			user.save();
	    					info = {user_id:body.user_id,player_id:newPlayer._id,game_id:game._id,};
	    					res.status(200).json(jsonBody('game join OK',info));
	    				}
	    			});
	    		}
	    	});
	    }
	});
});

function setTargetForPlayer(player_id,target_id) {
	Player.findById(player_id, function(err, player) {
	    if (err || !player) {
	    	res.status(505).json(jsonBody("505 Error",err));
	    	return;
	    }
	    else {
	    	player.target_id = mongoose.Types.ObjectId(target_id);
	    	player.save();
		}
	});
}

function prepareGame(game) {
	players = game.players;
	len = players.length;
	target = 1;
	for(i = 0; i < len; i++) {
		setTargetForPlayer(players[i],players[target]);
		target++;
		if (target == len)
			target = 0;
	}
	return players;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}


gameStartRoute.put(function(req, res) {
	body = req.body;
	Game.findById(req.params.id, function(err, game) {
	    if (err || !game) {
	    	res.status(404).json(jsonBody('404 Error','Game ID does not exist'));
	    	return;
	    }
	    else {
	    	game.players = shuffle(game.players);
	    	prepareGame(game);
	    	//game.markModified('players');
	    	game.hasStarted = true;
	    	game.markModified('players');
	    	game.save();
			info = {game_id:game._id,};
	    	res.status(200).json(jsonBody('game start OK',info));
	    }
	});
});


/*PLAYER */
playerRoute.get(function(req, res) {
	req.query.where ? conditions = JSON.parse(req.query.where) : conditions = null;
	req.query.count ? countBool = JSON.parse(req.query.count) : countBool  = false;

	if (countBool === true) {	
		Player.count({}, function( err, count){
		    res.status(200).json({message: "OK", data: count}); 
		});	
	}
	else {
		Player.find(conditions, null, null, function(err, players) {
		    if (err) {
		      res.status(404).json(jsonBody('404 Error',err));
		      return;
		    }
		   	res.status(200).json(jsonBody('player list OK',players));
		});	
	}
});

playerIDRoute.get(function(req, res) {
	Player.findById(req.params.id, function(err, target) {
	    if (err || !target) {
	    	res.status(404).json(jsonBody("404 Error","Could not find Player"));
	    	return;
	    }
	    else {
			res.status(200).json(jsonBody('player ID OK',target));
		}
	});
});

playerReportRoute.put(function(req, res) {
	body = req.body;
	Player.findById(req.params.id, function(err, killer) {
	    if (err || !killer) {
	    	console.log(err);
	    	res.status(404).json(jsonBody("404 Error","Could not find Killer"));
	    	return;
	    }
	    else {
	    	target_id = killer.target_id;
	    	Player.findById(target_id, function(err, targetPlayer) {
	    		if (err || !targetPlayer) {
	    			res.status(404).json(jsonBody("404 Error","Could not find Target"));
			    	return;
	    		}
	    		else if (targetPlayer.secret_code == body.secret_code) {
	    			targetPlayer.isAlive = false;
	    			killer_id = mongoose.Types.ObjectId(killer._id);
	    			target_id = mongoose.Types.ObjectId(targetPlayer._id);
	    			new_killer_id = mongoose.Types.ObjectId(targetPlayer.target_id);
	    			targetPlayer.killer_id = killer_id;
	    			//targetPlayer.game_id = killer.game_id;
	    			targetPlayer.save();
	       			newKill = new Kill({killer_id:killer_id,target_id:target_id,game_id:killer.game_id});
	       			newKill.save();
	    			killer.killed.push(mongoose.Types.ObjectId(newKill._id));
	    			killer.target_id = new_killer_id;
	    			killer.markModified('killed');
	    			killer.save();
					res.status(200).json(jsonBody('player Report OK',newKill));
	    		}
	    		else {
			    	res.status(404).json(jsonBody("404 Error","Secret Code Invalid"));
			    	return;
	    		}
	    	});
	    }
	});	
});

/* MESSAGE */

messagePIDRoute.post(function(req, res) {
	var sender_id  = mongoose.Types.ObjectId(req.params.id);
	var recipient_id  = mongoose.Types.ObjectId(req.body.recipient_id);
	var body = req.body.body;
	
	var data = {
		recipient_id : recipient_id,
		sender_id : sender_id,
		body : body
	};

	var msg = new Message(data);

	msg.save(function(err){
		if(err) { 
			res.status(404).json(jsonBody("404 Error","Message could not be saved"));
			return;
		}
		else {
			res.status(200).json(jsonBody('message OK',msg));
		}
	});

});

messagePIDRoute.get(function(req, res) {
	var sender_id  = mongoose.Types.ObjectId(req.params.id);
	var conditions = {
		sender_id : sender_id
	}

	Message.find(conditions, function(err, target) {
		if(err || !target) {
			res.status(404).json(jsonBody("404 Error","Could not find Messages"));
			return;
		}
		else {
			res.status(200).json(jsonBody('message OK',target));
		}
	}).sort({ dateCreated : -1 });	// sort most recent first
});

messageIDRoute.get(function(req, res){

});



app.listen(port);
console.log('Server running on port ' + port); 