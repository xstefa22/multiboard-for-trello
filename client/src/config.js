const config = {
    server: "",
    requestURL: "https://trello.com/1/OAuthGetRequestToken",
    accessURL: "https://trello.com/1/OAuthGetAccessToken",
    authorizeURL: "https://trello.com/1/OAuthAuthorizeToken",
    loginCallback: '/auth/callback', // Prepend with your server address
    
    appName: "Multiboard for Trello",
    scope: 'read,write',
    expiration: 'never',

    // /update route for server, use app like ngrok when not in production
    webhookCallbackURL: '/update',

    dev: false, // Uses credentials from this file instead of from DB
    onlyClient: false, // No login screen, no webhooks, use only if 'dev' equals true
    username: '', // Your Trello username
    apiKey: '', // Your Trello API KEY
    token: '', // Your Trello token

    mongoDB: 'mongodb+srv://kouby:solek481@multiboardfortrello-hbvnd.gcp.mongodb.net/test?retryWrites=true&w=majority', // Your MongoDB connection
};

export default config;
