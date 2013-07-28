
/*
 * GET home page.
 */
 
var OAuth = require('oauth').OAuth,
	config = require('../config'),
	util = require('util'),
	querystring = require('querystring'),
	Twit = require('../models/twit'),
	url = require('url');


var global_secret_lookup = {};

var oa = new OAuth(config.settings.twitterAuth.urls.requestToken, 
					config.settings.twitterAuth.urls.accessToken,
					config.settings.twitterAuth.key, 
					config.settings.twitterAuth.secret, 
					'1.0', 
					null, 
					'HMAC-SHA1');

// Need to add some checking for previous authentication
// right now this method will make the user authorize the app
// everytime the session expires
exports.oauth = function(req, res){
	function getOAuthRequestTokenFunc(error, oauth_token, oauth_token_secret, results){
		if (error) return console.log('getOAuthRequestToken Error', error);
		req.session.callmade = true;
		req.session.oAuthVars = {};
		req.session.oAuthVars.oauth_token = oauth_token;
		req.session.oAuthVars.oauth_token_secret = oauth_token_secret;
		console.log('Redirecting to: ', config.settings.twitterAuth.urls.authEndpoint + oauth_token);
		res.redirect(config.settings.twitterAuth.urls.authEndpoint + oauth_token);
	}
	oa.getOAuthRequestToken(getOAuthRequestTokenFunc);
};


exports.oauth_callback = function(req, res){
	if (req.session.hasOwnProperty('callmade')) {
		if(req.session.hasOwnProperty('twitter')){
			res.redirect('/');
		}else{
			var twit = new Twit(req.session.oAuthVars.oauth_token, req.session.oAuthVars.oauth_access_token);
			twit.getOAuthAccessToken(req.param('oauth_verifier'),function(err, user, oAuthVars){
				if(err){
					res.redirect('/oauth');
				}else{
					req.session.twitter = {
						user: user,
						oAuthVars: oAuthVars
					};
					res.redirect('/');
				}
			});
		}
	}else {
		res.redirect('oauth');
	}
};

exports.logout = function(req, res){
	if(req.session.twitter != null && req.session.twitter.user != null && req.session.twitter.user.screen_name != null){
		var twit = new Twit(req.session.oAuthVars.oauth_token, req.session.oAuthVars.oauth_access_token);
		twit.clearUser(req.session.twitter.user.screen_name,function(err){
			if(err){
				console.log('logout err: ', err);
			}
			req.session = null;
			console.log(req.session);
			res.redirect('/');
		});
	}else{
		req.session = null;
		console.log(req.session);
		res.redirect('/');
	}
};