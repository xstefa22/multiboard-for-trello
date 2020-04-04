const config = {
    requestURL: "https://trello.com/1/OAuthGetRequestToken",
    accessURL: "https://trello.com/1/OAuthGetAccessToken",
    authorizeURL: "https://trello.com/1/OAuthAuthorizeToken",
    appName: "Multiboard for Trello",
    scope: 'read,write',
    expiration: 'never',

    dev: true, // Uses credentials from this file instead of from DB
    onlyClient: true, // No login screen, use only if 'dev' equals true
    username: '', // Your Trello username
    apiKey: '', // Your Trello API KEY
    token: '' // Your Trello token
};

export default config;
