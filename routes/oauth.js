
/*
 * GET home page.
 */
 
var OAuth = require('oauth').OAuth,
    sys = require('sys'),
    url = require('url');

var _twitterConsumerKey = "mHhRqtHf6UI8Rr6jihEPBA";
var _twitterConsumerSecret = "RRk6zEvQoT06zkPrnjiPY6emfDuvWnwZ8IYZ5K2938";
var _twitterAuthEndpointUrl = "https://api.twitter.com/oauth/authentication?oauth_token=";
var _requestTokenUrl = "https://api.twitter.com/oauth/request_token";
var _authorizeUrl = "https://api.twitter.com/oauth/access_token";
var _callbackUrl = "http://twitoptic.ninnemana.c9.io/oauth/callback";
var global_secret_lookup = {};

var oa = new OAuth(_requestTokenUrl, 
                    _authorizeUrl
                    ,_twitterConsumerKey, 
                    _twitterConsumerSecret, 
                    '1.0', 
                    null, 
                    'HMAC-SHA1');

exports.oauth = function(req, res){
    console.log("Default Url");
    oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
        if(error){
            console.log('error: ' + sys.inspect(error));
            var errResponse = 'Unable to retrieve request token';
            res.writeHead(200, {'Content-Type':'text/plain','Content-Length': errResponse.length});
            res.end(errResponse);
        }else{
            console.log('oauth_token:' + oauth_token);
            console.log('oauth_token_secret: ' + oauth_token_secret);
            console.log('request token results: ' + sys.inspect(results));
            
            global_secret_lookup[oauth_token] = oauth_token_secret;
            
            var twitterAuthEndpoint = _twitterAuthEndpointUrl + oauth_token;
            console.log('Redirect to: ' + twitterAuthEndpoint);
            res.writeHead(301, {
                'Content-Type': 'text/plain',
                'Location': twitterAuthEndpoint
                });
                
            res.end('Redirecting...\n');
            
        }
    });
  //res.render('index', { title: 'Express' });
};

exports.oauth_callback = function(req, res){
    console.log('Callback Url');
  
    var parsedUrl = URL.parse(req.url);
    var parsedQuery = querystring.parse(parsedUrl.query);
    
    console.log(parsedQuery);
    
    res.end(parsedQuery);
};