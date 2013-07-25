
/*
 * GET home page.
 */
 
var OAuth = require('oauth').OAuth,
    config = require('../config'),
    util = require('util'),
    querystring = require('querystring'),
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

            // TODO
            // ---------------------------------
            // We need to move the logic below to use the set_user method in models/twit.js
            // that will leverage redis for storage so we don't have to query the API
            // unnecessarily.

            //var oa = makeOAuth();
            oa.getOAuthAccessToken(req.session.oAuthVars.oauth_token, req.session.oAuthVars.oauth_token_secret, req.param('oauth_verifier'),
            function(error, oauth_access_token,oauth_access_token_secret, tweetRes) {
            if (error) {
                console.log('getOAuthAccessToken error: ', error);
                //do something here UI wise
                return;
            }
            req.session.oAuthVars.oauth_access_token = oauth_access_token;
            req.session.oAuthVars.oauth_access_token_secret = oauth_access_token_secret;
            req.session.oAuthVars.oauth_verifier = req.param('oauth_verifier');
            //
            console.log(tweetRes);
            var obj = {};
            obj.user_id = tweetRes.user_id;
            obj.screen_name = tweetRes.screen_name;
            obj.oauth_access_token = oauth_access_token;
            obj.oauth_access_token_secret = oauth_access_token_secret;
            obj.profile_image_url = tweetRes.profile_image_url;
            req.session.twitter = {};
            req.session.twitter.user = obj;
            console.log(obj);
            //Here we add the 'obj' contain the details to a DB and user this to get the users access details.
            res.redirect('/');
            });
        }
        else {
            res.redirect('oauth');
        }
};