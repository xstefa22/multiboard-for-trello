import config from '../../client/src/config.js';
const socket = require('socket.io-client')(config.server);

module.exports = (app) => {
    app.head('/update', (request, response, next) => {
        response.sendStatus(200);
    });

    app.post('/update', (request, response, next) => {
        socket.emit('update', request.body);

        response.sendStatus(200);
    });
}
