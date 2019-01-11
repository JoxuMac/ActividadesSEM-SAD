var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/chat.html');
});

io.on('connection', (socket) => {
  
  console.log('a user connected');
  socket.broadcast.emit('user connected', 'Se ha conectado un nuevo usuario');

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.sockets.emit('user connected', 'Se ha desconectado un usuario');
  });

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
