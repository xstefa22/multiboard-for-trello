const config = {
    server: '', // Your server address
    requestURL: "https://trello.com/1/OAuthGetRequestToken",
    accessURL: "https://trello.com/1/OAuthGetAccessToken",
    authorizeURL: "https://trello.com/1/OAuthAuthorizeToken",
    loginCallback: '/auth/callback', // Prepend with your server address
    mongoDB: '', // Your MongoDB connection
};

export default config;
