
/*
 * GET home page.
 */
 
var config = require('../config'),
	async = require('async'),
	Twit = require('../models/twit');

 exports.index = function(req, res){
 	if(!req.session.hasOwnProperty('oAuthVars') || !req.session.hasOwnProperty('twitter')){
 		res.redirect('/oauth');
 		return;
 	}else{
 		if(!req.session.twitter.hasOwnProperty('user') || req.session.twitter.user == null){
 			res.redirect('/oauth');
 			return;
 		}
 		var twit = new Twit(req.session.oAuthVars.oauth_token, req.session.oAuthVars.oauth_access_token);
		async.parallel({
			user: function(callback){
				twit.getUser(req.session.twitter.user.screen_name,function(err, user){
					callback(err,user);
				});
			},
			tweets: function(callback){
				callback(null,[]);
				// tw.get('statuses/home_timeline',{screen_name: req.session.twitter.user.screen_name},function(err, reply){
				// 	callback(err, reply);
				// });
			}
		},function(err,results){
			if(results.user == null){
				res.redirect('/oauth');
				return;
			}
			//console.log(results);
			console.log(err);
			res.render('index', {title: 'TwitOptic', user: results.user, tweets: results.tweets});
		});
	}
 };