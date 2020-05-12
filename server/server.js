import config from '../client/src/config.js';
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
const OneTimeUser = require('./db/OneTimeUser.js');


const mongoDB = config.mongoDB;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
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
    const { username } = data.model;

    OneTimeUser.findOne({ username }, (err, u) => {
      if (!u) {
          User.findOne({ username }, (error, user) => {
          if (user) {
            io.to(user.socketId).emit('update', data);
          }
        });
      } else {
        io.to(u.socketId).emit('update', data);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected. Socket id %s', socket.id);
  });

  socket.on('authorization', async (data) => {
    const { username, oneTime } = jwt.decode(data);

    if (oneTime || config.dev) {
      OneTimeUser.findOneAndUpdate({ username }, { socketId: socket.id }, { upsert: true, new: true, setDefaultsOnInsert: true }, (err, results) => { });
    } else {
      User.updateOne({ username }, { username, socketId: socket.id });
    }
  });

  socket.on('deauthorization', async (data) => {
    const { username, oneTime } = jwt.decode(data);

    if (oneTime || config.dev) {
      OneTimeUser.deleteOne({ username }, (error, result) => {});
    } else {
      User.updateOne({ username }, { socketId: '' });
    }
  })
});

http.listen(3001, () => {
  console.log('Server is running and listening on port 3001');
});
