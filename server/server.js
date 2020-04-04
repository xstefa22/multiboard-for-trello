import config from './config.js';
const passport = require('passport');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');


const mongoDB = config.mongoDB;

mongoose.connect(mongoDB, { });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(session({
  name: 'Multiboard for Trello',
  resave: false,
  saveUninitialized: false,
  secret: 'register_data',
  cookie: {},
}));

app.use(passport.initialize());
app.use(passport.session());

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

io.on('connection', (socket) => {
  console.log('User connected. Socket id %s', socket.id);

  socket.on('update', (data) => {
    console.log(data);
    socket.broadcast.emit('update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected. %s. Socket id %s', socket.id);
  });
});

http.listen(3001, () => {
  console.log('listening on: 3001');
});
