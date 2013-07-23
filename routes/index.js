
/*
 * GET home page.
 */
 
var config = require('../config'),
	Twit = require('twit');

 exports.index = function(req, res){
 	if(!req.session.hasOwnProperty('oAuthVars')){
 		res.redirect('/oauth');
 		return;
 	}
 	var tw = new Twit({
 		consumer_key: config.settings.twitterAuth.key,
 		consumer_secret: config.settings.twitterAuth.secret,
 		access_token: req.session.oAuthVars.oauth_access_token,
 		access_token_secret: req.session.oAuthVars.oauth_access_token_secret
 	});

 	tw.get('users/show',{screen_name: req.session.twitter.user.screen_name},function(err, reply){
 		res.render('index', {title: 'TwitOptic', user: reply});
 	});
 };