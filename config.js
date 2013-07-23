// Configuration Settings...

exports.settings = {
	twitterAuth:{
		key: '',
		secret: '',
		urls: {
			authEndpoint: 'https://api.twitter.com/oauth/authenticate?oauth_token=',
			requestToken: 'https://api.twitter.com/oauth/request_token',
			accessToken: 'https://api.twitter.com/oauth/access_token',
			callback: 'http://localhost:3000/oauth/callback'
		}
	}
}