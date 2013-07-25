var oauth = require('oauth').OAuth,
	redis = require('redis');

var client = redis.createClient(6379, 'nodejitsudb9741802155.redis.irstack.com'),
	authed = false;

client.auth('nodejitsudb9741802155.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4', function (err) {
if (!err) { authed = true; }

});

var client = redis.createClient(5309, 'ninnemana.twitoptic.redistogo.com');

client.on('error',function(err){
	console.log('redis error: ', err);
});

function Twit(token, secret){
	// Authentication
	this.oauthToken = token;
	this.oauthTokenSecret = secret;

	// OAuth constructed object
	this.oauth = null;
	var _userInfo = function(){};
}

Twit.prototype = {
	makeOAuth: function(request_token, access_token, key, secret, version, cb, enc){
		this.oauth = new OAuth(request_token, access_token, key, secret, version, cb, enc);
	},
	set_user: function(user,callback){
		user_str = JSON.stringify(user);
		client.set(this.oauthToken, user_str);
	},
	get_user:function(name,callback){


	},
	userInfo: function(name, callback){
		this.oauth.getProtectedResource(
			'https://api.twitter.com/1.1/users/show.json?screen_name='+name,
			'GET',
			this.oauthToken,
			this.oauthTokenSecret,
			function(err, data, resp){
				var arr = [], obj, parsedData;
				if(err){
					console.log('error', err);
					callback(err);
				}else{
					parsedData = JSON.parse(data);
					for(var i = 0; i < parsedData.length; i++){
						obj = {};
					}
				}
			});
	}

};

exports = module.exports = Twit;