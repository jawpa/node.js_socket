// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
// var io = require('../..')(server);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

// ejecutamos el listening dónde escuchamos al puerto
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
// middleware para definir la carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;

// ****** variable creada por nosotros
var usernames = {};
// **************

io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  // el servidor espera este evento en el lado del cliente
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

   // ******************* modificamos el original
  // ******************** comprobamos que el nombre no exista
  // manejador del evento exists user
  socket.on('exists user', (username,cb) => {
    // validamos si el usuario tiene la propiedad username que pasa el cliente
    if (usernames.hasOwnProperty(username)) {
      console.log('el usuario ya existe')
      // ejecutamos la callback definida en el lado del cliente 
      cb(false) 
    }else{
      console.log('el usuario no existe')
      cb(true)
    }
  });
// ***************************************
// ****************************************

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});