var OAuth = require('oauth').OAuth,
	redis = require('redis'),
	config = require('../config')
	Tweeter = require('twit');

var client = redis.createClient(6379, 'nodejitsudb9741802155.redis.irstack.com'),
	authed = false,
	tw = {};

client.auth('nodejitsudb9741802155.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4', function (err) {
if (!err) { authed = true; }

});

client.on('error',function(err){
	console.log('redis error: ', err);
});

function Twit(token, secret){
	// Authentication
	this.oauthToken = token;
	this.oauthTokenSecret = secret;

	// OAuth constructed object
	this.oauth = new OAuth(config.settings.twitterAuth.urls.requestToken,
								config.settings.twitterAuth.urls.accessToken,
								config.settings.twitterAuth.key,
								config.settings.twitterAuth.secret,
								'1.0',
								null,
								'HMAC-SHA1');
	var _userInfo = function(){};
}

Twit.prototype = {
	makeOAuth: function(){
		this.oauth = new OAuth(config.settings.twitterAuth.urls.requestToken,
								config.settings.twitterAuth.urls.accessToken,
								config.settings.twitterAuth.key,
								config.settings.twitterAuth.secret,
								'1.0',
								null,
								'HMAC-SHA1');
	},
	getOAuthAccessToken: function(verifier, callback){
		var that = this;
		this.oauth.getOAuthAccessToken(this.oauthToken, this.oauthTokenSecret, verifier,
			function(err,oauth_access_token, oauth_access_token_secret, tweetRes){
			if(err){
				calback(err, null, null);
			}else{
				tw = new Tweeter({
					consumer_key: config.settings.twitterAuth.key,
					consumer_secret: config.settings.twitterAuth.secret,
					access_token: oauth_access_token,
					access_token_secret: oauth_access_token_secret
				});
				that.getUser(tweetRes.screen_name,function(err, reply){
					if(err || reply == null){
						callback(err,null,null);
					}else{
						var user = reply;
						user.oauth_access_token = oauth_access_token;
						user.oauth_access_token_secret = oauth_access_token_secret;

						client.set('twitter:user:' + user.screen_name, JSON.stringify(user));

						var oAuthVars = {
							oauth_access_token: oauth_access_token,
							oauth_access_token_secret: oauth_access_token_secret,
							oauth_verifier: verifier
						};
						callback(null, user, oAuthVars);
					}
				});
			}
		});
	},
	setUser: function(user,callback){
		if(this.oauth == null){
			this.makeOAuth();
		}
		user_str = JSON.stringify(user);
		client.set(this.oauthToken, user_str);
	},
	getUser:function(name,callback){
		if(this.oauth == null){
			this.makeOAuth();
		}
		client.get('twitter:user:'+name,function(err,reply){
			if(err || reply == null){
				tw.get('users/show',{screen_name: name},function(err, reply){
					callback(err,reply);
				});
			}else{
				callback(err, JSON.parse(reply));
			}
		});
	},
	clearUser:function(name,callback){
		if(this.oauth == null){
			this.makeOAuth();
		}
		client.del(name);
		callback(null);
	}
};

exports = module.exports = Twit;