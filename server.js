//"use strict";

var express = require('express');
var app = express();

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
});

var port = process.env.PORT || 4000;

var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	next();
};
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use('/api', router);

//API Routes
var homeRoute = router.route('/');
var registerRoute = router.route('/register');
var signinRoute = router.route('/signin');
var gameRoute = router.route('/game');
var gameIDRoute = router.route('/game/:id');
var gameJoinRoute = router.route('/game/:id/join');

var playerRoute = router.route('/:gid/players');
var playerIDRoute = router.route('/player/:id');
var playerReportRoute = router.route('/player/report');

var adminDeleteGameRoute = router.route('/admin/delete_game');
var adminRemovePlayerRoute = router.route('/admin/remove_player');
var adminStartGameRoute = router.route('/admin/start');

var messageGUIDRoute = router.route('/message/g/:gid/u/:uid');
var messageGMIDRoute = router.route('/message/g/:gid/m/:mid');

var announcementRoute = router.route('/announcement/g/:id');

var killRoute = router.route('/kills');

var userAccountRoute = router.route('/user');
var userAccountIDRoute = router.route('/user/:id');
//API Routes

homeRoute.get(function(req, res) {
	res.json(jsonBody("Check if mongo has connected","Hello Spwned"));
});

function isRegisterValid(req) {
	body = req.body;
	if (body.password=='' 		|| body.password == null 		||
			body.email=='' 				|| body.email == null				||
			body.first_name == '' || body.first_name == null 	||
			body.last_name == '' 	|| body.last_name == null			) {
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

function makeSecretCode()
{
    var secret = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 4; i++ )
        secret += possible.charAt(Math.floor(Math.random() * possible.length));

    return secret;
}

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

function validatePlayerID(player_id, game_id, req, res, callback) {
	Game.findById(game_id, function(err, game) {
		if (err || !game) {
			callback(false,req,res);
		}
		else {
			for (i = 0; i < game.players.length; i++) {
				if (game.players[i] == player_id) {
					callback(true,req,res);
					return;
				}
			}
			callback(false,req,res);
		}
	});
}

function validateAdminID(admin_id, game_id, req, res, callback) {
	Game.findById(game_id, function(err, game) {
		if (err  || !game) {
			callback(false,req,res);
		}
		else {
			if (game.admin_id == admin_id)	
				callback(true,req,res);
			else
				callback(false,req,res);
		}
	});
}

function validateUserID(game_id,user_id,res) {
	Game.findById(game_id, function(err, game) {
	    if (err || !game) {
	    	return [null,null];
	    }
	    else {
	    	Admin.find({user_id:user_id,game_id:game_id}, function(err,admin) {
				if (admin && admin.length > 0) {
					if (game.admin_id.equals(admin[0]._id)) {
						game = game.toJSON()
						game.admin_token = admin[0]._id;
						game.player_token = null;
						res.status(200).json(jsonBody("game select admin OK",game));
						return;
					}
				}
				else {
					Player.find({user_id:user_id,game_id:game_id}, function(err,player) {
						if (player && player.length > 0) {
							for (i = 0; i < game.players.length; i++) {
								if (game.players[i].equals(player[0]._id)) {
									game = game.toJSON()
									game.player_token = player[0]._id;
									game.admin_token = null;
									res.status(200).json(jsonBody("game select player OK",game));
									return;
								}
							}
						}
						res.status(404).json(jsonBody("404 Error", "Could not find user_id"));
						return;
					});
				}
	    	});
	    }
	});
}

/*AUTHENTICATION */
registerRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

// create a new user
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

// sign in
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

//game list
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
		    res.status(200).json({message: "game list OK", data: games});
		});
	}

});

// create a new game
gameRoute.post(function(req, res){
	var body = req.body;
	if (!body) {
		res.status(404).json(jsonBody("404 Error","Invalid Input"));
		return;
	}
	user_id = body.user_id;
	UserAccount.findById(user_id, function(err,user) {
		if (err || !user) {
			res.status(404).json(jsonBody("404 Error","Invalid user ID"));
			return;
		}
		else {
			delete body.user_id;
			var newGame = new Game(body);
			newGame.save(function (err) {
				if(err) {
					res.status(404).json(jsonBody("404 Error",err));
					return;
				}
				else {
					newAdmin = new Admin({user_id:user_id,game_id:newGame._id});
					newGame.admin_id = newAdmin._id;
					newAdmin.save();
					UserAccount.findById(user_id,function(err, user) {
						user.games.push(mongoose.Types.ObjectId(newGame._id));
						user.save(function(err) {
							newGame.save(function (err) {
								if (err)
									res.status(505).json(jsonBody("505 Error",err));
								else {
									res.status(201).json(jsonBody("game creation OK",newGame));
								}
							});
						});
					});
				}
			});
		}
	});
});

// get a specific game
gameIDRoute.get(function(req, res) {
	user_id = req.query.user_id;
	if (!user_id) {
    	res.status(404).json(jsonBody("404 Error","Please include a user_id"));
    	return;
	}
	validateUserID(req.params.id,user_id,res);
});

// join the game (as a player)
gameJoinRoute.put(function(req, res) {
	body = req.body;
	Game.findById(req.params.id, function(err, game) {
	  if (err || !game) {
	    		res.status(404).json(jsonBody("404 Error","Cannot find game"));
	    return;
	  }
	  else {
	  	if (game.capacity <= game.players.length) {
	    	res.status(404).json(jsonBody("404 Error","Game is full capacity"));
		    return;
	  	}

	  	Player.find({user_id:body.user_id,game_id:game._id},function(err,players) {
	  		if (players && players.length > 0) {
	    		res.status(404).json(jsonBody("404 Error","User is already part of this game"));
	    		return;
	    	}
	  		else {
			    UserAccount.findById(body.user_id,function(err, user) {
			    	if (err || !user) {
			    		res.status(404).json(jsonBody("404 Error","Could not join. Invalid User"));
			    		return;
			    	}
			    	else {
			    		var data = {
			    			user_id : body.user_id,
			    			game_id : game._id,
			    			secret_code : makeSecretCode()
			    		}
			    		var newPlayer = new Player(data);
			    		game.players.push(mongoose.Types.ObjectId(newPlayer._id));
			    		newPlayer.save();

			    		game.save(function(err) {
			    		if (err) {
					    			res.status(505).json(jsonBody("505 Error",err));
					    		}
			    				else {
			    					user.games.push(mongoose.Types.ObjectId(game._id));
					    			user.save();

			    					var info = {
			    						user_id : body.user_id,
			    						player_id : newPlayer._id,
			    						game_id : game._id,
			    					};
			    					res.status(200).json(jsonBody('game join OK',info));
			    				}
			    			});
			    		}
			    	});
			    }
			});
		}
	});
});

/*PLAYER */
playerRoute.get(function(req, res) {
	req.query.where ? conditions = JSON.parse(req.query.where) : conditions = null;
	req.query.count ? countBool = JSON.parse(req.query.count) : countBool  = false;
	// var game_id = req.params.gid;

	if (countBool === true) {
		Player.count({ game_id: req.params.gid }, function( err, count){
		    res.status(200).json({message: "OK", data: count});
		});
	}
	else {
		Player.find({ game_id: req.params.gid }, null, null, function(err, players) {
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
	Game.findById(body.game_id, function(err, game){
		if(err || !game){
			res.status(404).json(jsonBody("404 Error", "Could not find game"));
			return;
		}
		else {
			if(!game.hasStarted){
				res.status(500).json(jsonBody("500 Internal Error", "Game hasn't started yet."));
				return;
			}
			validatePlayerID(body.player_id,body.game_id,req,res,playerReportCallBack);
		}
	});
});

function checkGameStatus(game_id) {
	Player.find({game_id: game_id}, function(err, players) {
		var potentialWinners = [];
		for (i = 0; i < players.length; i++) {
			if (players[i].isAlive)
				potentialWinners.push(players[i]._id);
		}
		if (potentialWinners.length == 1) {
			Game.findById(game_id, function(err, game){
				if (game.isFinished)
					return;
				game.winners.push(potentialWinners[0]);
				game.isFinished = true;
				game.end_date = Date(Date.now());
				game.save();
			});
		}
	});
}

function playerReportCallBack(valid,req,res) {
	if (!valid) {
	   	res.status(404).json(jsonBody("404 Error","Player ID Validiation Failed"));
		return;
	}
	body = req.body;
	Player.findById(body.player_id, function(err, killer) {
	    if (err || !killer) {
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
	    			targetPlayer.target_id = null;
	    			//targetPlayer.game_id = killer.game_id;
	    			targetPlayer.save();
	       			newKill = new Kill({killer_id:killer_id,target_id:target_id,game_id:killer.game_id});
	       			newKill.save();
	    			killer.killed.push(mongoose.Types.ObjectId(newKill._id));
	    			killer.target_id = new_killer_id;
	    			killer.markModified('killed');
	    			killer.save(function(err){
	    				checkGameStatus(body.game_id);
	    			});

					res.status(200).json(jsonBody('player Report OK',newKill));
	    		}
	    		else {
			    	res.status(404).json(jsonBody("404 Error","Secret Code Invalid"));
			    	return;
	    		}
	    	});
	    }
	});
}

/* ADMIN */
adminDeleteGameRoute.delete(function(req, res){
	body = req.body;
	validateAdminID(body.admin_id,body.game_id,req,res,adminDeleteGameCallBack);
});

function adminDeleteGameCallBack(valid,req,res) {
	if (!valid) {
	   	res.status(404).json(jsonBody("404 Error","Admin ID Validiation Failed"));
		return;
	}
	body = req.body;
	var adminId = body.admin_id;
	var gameId = body.game_id;

	Game.findById(gameId, function(err, game) {
		if(err || !game) {
			res.status(404).json(jsonBody("404 Error", "Could not delete game"));
			return;
		}
		else {
			Admin.findById({_id:game.admin_id}, function(err,admin) {
				UserAccount.findById(admin.user_id, function(err,user) {
					var gameIndex = user.games.indexOf(game._id);
					user.games.splice(gameIndex,1);
					user.save();
					admin.remove();
				});
			});
			Kill.find({game_id:gameId},function(err,kills) {
				if (kills && kills.length > 0) {
					for (i = 0; i < kills.length; i ++)
						kills[i].remove();				
				}
			});
			Message.find({game_id:gameId}, function(err,messages) {
				if (messages && messages.length > 0) {
					for (i = 0; i < messages.length; i ++)
						messages[i].remove();				
				}
			});
			for (i = 0; i < game.players.length; i++){
				Player.findById(game.players[i], function(err, player) {
					UserAccount.findById(player.user_id,function(err, user) {
						var gameIndex = user.games.indexOf(game._id);
						user.games.splice(gameIndex,1);
						user.save();
						player.remove();
					});
				});
			}
			game.remove();
			res.status(200).json(jsonBody("Game deleted", "1"));
		}
	});
}


adminRemovePlayerRoute.delete(function(req, res){
	body = req.body;
	validateAdminID(body.admin_id,body.game_id,req,res,adminRemovePlayerCallBack);
});

function adminRemovePlayerCallBack(valid,req,res) {
	if (!valid) {
	   	res.status(404).json(jsonBody("404 Error","Admin ID Validiation Failed"));
		return;
	}
	body = req.body;
	var adminId = body.admin_id;
	var playerId = body.player_id;
	var gameId = body.game_id;
	// find out if game has started, then delete user if game has not yet started
	Game.findById(gameId, function(err, game){
		if(err || !game){
			res.status(404).json(jsonBody("404 Error", "Could not find game"));
			return;
		}
		else {
			if(game.hasStarted){
				res.status(500).json(jsonBody("500 Internal Error", "Cannot delete player if game has already started"));
				return;
			}
			else {
				Player.findById(playerId, function(err, player) {
					if(err || !player) {
						res.status(404).json(jsonBody("404 Error", "Could not find Player"));
						return;
					}
					else {
						var removeIndex = game.players.indexOf(playerId);
						game.players.splice(removeIndex,1);
						game.save();
						UserAccount.findById(player.user_id,function(err, user) {
							var gameIndex = user.games.indexOf(game._id);
							user.games.splice(gameIndex,1);
							user.save();
							player.remove();
							res.status(200).json(jsonBody("Player removed", "1"));
						});
					}
				});
			}
		}
	});
}

adminStartGameRoute.put(function(req, res) {
	body = req.body;
	Game.findById(body.game_id, function(err, game){
		if(err || !game){
			res.status(404).json(jsonBody("404 Error", "Could not find game"));
			return;
		}
		else {
			if(game.hasStarted){
				res.status(500).json(jsonBody("500 Internal Error", "Game has already started"));
				return;
			}
			validateAdminID(body.admin_id,body.game_id,req,res,adminStartGameCallBack);
		}
	});
});

function adminStartGameCallBack(valid,req,res) {
	if (!valid) {
	   	res.status(404).json(jsonBody("404 Error","Admin ID Validiation Failed"));
		return;
	}
	body = req.body;
	var gameId = body.game_id;

	Game.findById(gameId, function(err, game) {
	  if (err || !game) {
	    	res.status(404).json(jsonBody('404 Error','Game ID does not exist'));
	    	return;
    	}
    	else {
	    	game.players = shuffle(game.players);
	    	prepareGame(game);
	    	game.hasStarted = true;
	    	game.start_date = Date(Date.now());
	    	game.markModified('players');
	    	game.save();
			var info = {
				game_id:game._id,
			};
	    	res.status(200).json(jsonBody('game start OK',info));
	    }
	});
}


/* MESSAGE */

messageGUIDRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

// get the list of msgs that whose sender or recipient is current player
messageGUIDRoute.get(function(req, res) {
	var game_id = mongoose.Types.ObjectId(req.params.gid);
	var user_id  = mongoose.Types.ObjectId(req.params.uid);

	var conditions = {
		game_id: game_id,
		recipient_id: {'$ne': null}
	}

	Message.find(conditions, function(err, target) {
		if(err || !target) {
			res.status(404).json(jsonBody("404 Error","Could not find Messages"));
			return;
		}
		else {
			res.status(200).json(jsonBody('message OK',target));
		}
	}).or([{ sender_id : user_id }, { recipient_id : user_id }])
		.sort({ dateCreated : -1 });	// sort most recent first
});

// saves a new msg with current pleyer as a sender
messageGUIDRoute.post(function(req, res) {
	var game_id = mongoose.Types.ObjectId(req.params.gid);
	var sender_id  = mongoose.Types.ObjectId(req.params.uid);
	var recipient_id  = mongoose.Types.ObjectId(req.body.recipient_id);
	var body = req.body.body;

	if(!body) return res.status(404).json(jsonBody("404 Error","Message body required"));

	Game.findById(game_id, function(err, game){
		var index = game.players.indexOf(sender_id);
		if(index < 0 || sender_id != game.admin_id._str) {
			res.status(404).json(jsonBody("404 Error","User dose not belong to this game; Can't send message"));
			return;
		}
		else {
			var data = {
				game_id : game_id,
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
		}
	});
});

messageGMIDRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

messageGMIDRoute.get(function(req, res){
	var msg_id = req.params.mid;
	Message.findById(msg_id, function(err, target) {
		if(err) {
			res.status(404).json(jsonBody("404 Error","Message not found"));
		}
		else {
			res.status(200).json(jsonBody('message OK', target));
		}
	});
});

announcementRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

announcementRoute.get(function(req, res){
	var game_id = req.params.id;
	var body = req.body.boby;
	var conditions = {
		recipient_id : null,
		game_id : game_id
	}

	Message.find(conditions, function(err, target) {
		if(err || !target) {
			res.status(404).json(jsonBody("404 Error","Could not find announcements"));
			return;
		}
		else {
			res.status(200).json(jsonBody('announcement OK',target));
		}
	}).sort({ dateCreated : -1 });
});

announcementRoute.post(function(req, res){
	var game_id = req.params.id;
	var sender_id = req.body.admin_id;
	var recipient_id = null;
	var body = req.body.body;

	Game.findById(game_id, function(err, game){
		if(err) {
			res.status(404).json(jsonBody("404 Error","Announcement could not be saved"));
			return;
		}
		else if(sender_id != game.admin_id._str) {
			res.status(404).json(jsonBody("404 Error","User does not have admin privilege"));
			return;
		}
		else {
			var data = {
				game_id : game_id,
				recipient_id : recipient_id,
				sender_id : sender_id,
				body : body
			};

			var msg = new Message(data);

			msg.save(function(err){
				if(err) {
					res.status(404).json(jsonBody("404 Error","Announcement could not be saved"));
					return;
				}
				else {
					res.status(200).json(jsonBody('announcement OK',msg));
				}
			});
		}
	});

	

});

/*KILLS*/
killRoute.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

killRoute.get(function(req, res){
	Kill.find(req.query, function(err, kills) {
		if(err || !kills) {
			res.status(404).json(jsonBody("404 Error","Could not find kills"));
			return;
		}
		else {
			res.status(200).json(jsonBody('kill list OK',kills));
		}
	}).sort({ dateCreated : 1 });
});


/*USER ACCOUNT */
userAccountRoute.get(function(req, res) {
	UserAccount.find(null,function(err, users){
		if (err || !users) {
			res.status(500).json(jsonBody("500 Error","server error"));
			return;
		}
		else {
			res.status(200).json(jsonBody('user list OK',users));
		}
	});
});

userAccountIDRoute.get(function(req, res) {
	UserAccount.findById(req.params.id,function(err,user) {
		if (err || !user) {
			res.status(404).json(jsonBody("404 Error","Could not find User"));
			return;
		}
		else {
			res.status(200).json(jsonBody('user ID OK',user));
		}
	});
});

app.listen(port);
console.log('Server running on port ' + port);