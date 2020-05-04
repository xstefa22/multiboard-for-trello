import config from './config.js';
const passport = require('passport');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./db/User.js');


const mongoDB = config.mongoDB;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const sessionWare = session({
  name: 'Multiboard for Trello',
  resave: false,
  saveUninitialized: false,
  secret: 'register_data',
  cookie: {
  },
  sockets: [],
});

app.use(sessionWare);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

require('./routes/index')(app);

app.use(express.static(path.resolve('client/build')));

app.get('/*', (request, response, next) => {
  response.sendFile(path.resolve('client/build/index.html'));
});

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.use((socket, next) => {
  sessionWare(socket.request, socket.request.res, next);
});

io.sockets.on('connection', (socket) => {
  console.log('User connected. Socket id %s', socket.id);

  socket.on('update', (data) => {
    console.log(socket.request.session.sockets);
    const { username } = data.model;
    User.findOne({ username }, (error, user) => {
      if (error) {

      } else if (!user) {

      } else {
        io.to(user.socketId).emit('update', data);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected. Socket id %s', socket.id);

    User.findOne({ socketId: socket.id }, async (error, user) => {
      if (error) {

      } else if (!user) {

      } else {
        const res = await User.updateOne({ username: user.username }, { socketId: '' });
        console.log(res);
      }
    });
  });

  socket.on('authorization', async (data) => {
    const { username } = jwt.decode(data);

    const res = await User.updateOne({ username }, { socketId: socket.id });
  });
});

http.listen(3001, () => {
  console.log('listening on: 3001');
});
