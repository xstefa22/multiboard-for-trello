const config = {
    // localhost:3001 when using locally or prod URL
    server: "",
    
    appName: "Multiboard for Trello",
    read: true,
    false: true,
    expiration: '30days',

    // If you don't want to use Webhooks for receiving updates set true for onlyClient
    onlyClient: false,
    // /update - update route for Webhooks, when locally use something like ngrok
    webhookCallbackURL: '/update',
};

export default config;
