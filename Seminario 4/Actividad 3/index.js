var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/chat.html');
});

var listUsers = []

io.on('connection', (socket) => {
  var personNick = "";

  // console.log('a user connected');

  socket.on('User connected', (nick) => {
    personNick = nick;
    listUsers.push(nick);
    socket.broadcast.emit('user connection', 'Se ha conectado ' + personNick);
    io.sockets.emit('actualizar lista', listUsers);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.sockets.emit('user connection', 'Se ha desconectado ' + personNick);

    for (var i = 0; i < listUsers.length; i++) {
      if (listUsers[i] == personNick)
        listUsers.splice(i, 1);
    }

    io.sockets.emit('actualizar lista', listUsers);
  });

  socket.on('chat message', (msg) => {
      socket.broadcast.emit('chat message', msg);
  });

  socket.on('is typing', (nick) => {
    socket.broadcast.emit('is typing', nick + ' is typing...');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
