const config = {
    server: "",
    
    appName: "Multiboard for Trello",
    read: true,
    false: true,
    expiration: '30days',

    // /update route for server, use app like ngrok when not in production
    webhookCallbackURL: '/update',
};

export default config;
