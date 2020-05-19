const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(__dirname + '/db/db.json');
const db = low(adapter);


db.defaults({ users: [] }).write();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

require('./routes/index')(app);

app.use(express.static(path.resolve('client/build')));

app.get('/*', (request, response, next) => {
  response.sendFile(path.resolve('client/build/index.html'));
});

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.sockets.on('connection', (socket) => {
  console.log('User connected. Socket id %s', socket.id);

  socket.on('update', (data) => {
    const { id } = data.model;

    const user = db.get('users').find({ idMember: id }).value();
    if (user) {
      io.to(user.idSocket).emit('update', data);
    }
  });

  socket.on('authorization', async (data) => {
    const { idMember } = data;

    const user = db.get('users').find({ idMember }).value();
    if (user) {
      db.get('users').find({ idMember }).assign({ idSocket: socket.id }).write();
    } else {
      db.get('users').push({ idMember, idSocket: socket.id }).write();
    }
  });

  socket.on('disconnect', () => {
    db.get('users').remove({ idSocket: socket.id }).write();
  });
});

http.listen(3001, () => {
  console.log('Server is running and listening on port 3001');
});
