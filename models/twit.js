var oauth = require('oauth').OAuth;

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