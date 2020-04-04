import config from '../config.js';
const User = require('../db/User.js');
const OAuth = require('oauth').OAuth;
const passport = require('passport');
const { Strategy: TrelloStrategy } = require('passport-trello');
const url = require('url');
const jwt = require('jsonwebtoken');
let socket = require('socket.io-client')(config.server);

let oauth;

module.exports = (app) => {
    app.get('/auth/callback', (request, response) => {
        const query = url.parse(request.url, true).query;

        const token = query.oauth_token;
        const tokenSecret = request.session.tokenSecret;
        const verifier = query.oauth_verifier;

        const { username, password, key } = request.session;

        oauth.getOAuthAccessToken(token, tokenSecret, verifier, function (error, accessToken, accessTokenSecret, results) {
            const user = new User({ username, password, apiKey: key, token: accessToken });
            user.save((error) => {
                if (error) {
                    console.error(error);
                    response.status(500)
                        .json({
                            error: 'Failed to authorize user for Trello API'
                        });
                } else {
                    response.status(200);
                    response.redirect('/login');
                }
            });
        });
    });

    app.post('/user/register', async (request, response, next) => {
        const { username, key, secret, password } = request.body;

        User.findOne({ username }, (error, user) => {
            if (error) {
                console.error(error);
                response.status(500)
                    .json({
                        error: 'Internal error please try again'
                    });
            } else if (user) {
                response.status(401)
                    .json({
                        error: 'User already exists'
                    });
            } else {
                oauth = new OAuth(config.requestURL, config.accessURL, key, secret, "1.0A", config.loginCallback, "HMAC-SHA1");
                oauth.getOAuthRequestToken(function (error, token, tokenSecret, results) {
                    request.session.tokenSecret = tokenSecret;
                    request.session.username = username;
                    request.session.password = password;
                    request.session.key = key;

                    response.send(token);
                });
            }
        });
    });

    app.post('/user/login', async (request, response, next) => {
        const { username, password } = request.body;

        User.findOne({ username }, (error, user) => {
            if (error) {
                console.error(error);
                response.status(500)
                    .json({
                        error: 'Internal error, please try again'
                    });
            } else if (!user) {
                response.status(401)
                    .json({
                        error: 'Incorrect email or password'
                    });
            } else {
                user.isCorrectPassword(password, (error, same) => {
                    if (error) {
                        response.status(500)
                            .json({
                                error: 'Internal error, please try again'
                            });
                    } else if (!same) {
                        response.status(401)
                            .json({
                                error: 'Incorrect email or password'
                            });
                    } else {
                        const payload = { username: user.username, apiKey: user.apiKey, token: user.token };
                        const secret = user.username;
                        const jwtToken = jwt.sign(payload, secret, { expiresIn: '2h' });

                        response.status(200).json({ jwtToken });
                    }
                });
            }
        });
    });

    app.head('/update', (request, response, next) => {
        response.sendStatus(200);
    });

    app.post('/update', (request, response, next) => {
        socket.emit('update', request.body);

        response.sendStatus(200);
    });
}
