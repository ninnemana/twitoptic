
/*
 * GET home page.
 */
 
var config = require('../config'),
	async = require('async'),
	Twit = require('twit');

 exports.index = function(req, res){
 	if(!req.session.hasOwnProperty('oAuthVars')){
 		res.redirect('/oauth');
 		return;
 	}else{
 		console.log(req.session)
		var tw = new Twit({
			consumer_key: config.settings.twitterAuth.key,
			consumer_secret: config.settings.twitterAuth.secret,
			access_token: req.session.oAuthVars.oauth_access_token,
			access_token_secret: req.session.oAuthVars.oauth_access_token_secret
		});

		async.parallel({
			user: function(callback){
				tw.get('users/show',{screen_name: req.session.twitter.user.screen_name},function(err, reply){
					callback(err,reply);
				});
			},
			tweets: function(callback){
				tw.get('statuses/home_timeline',{screen_name: req.session.twitter.user.screen_name},function(err, reply){
					callback(err, reply);
				})
			}
		},function(err,results){
			console.log(err);
			res.render('index', {title: 'TwitOptic', user: results.user, tweets: results.tweets});
		});
	}
 };