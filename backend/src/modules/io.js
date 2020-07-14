const socketio = require('socket.io');

function io(server) {
  const io = socketio(server);

  io.on('connect', (socket) => {
    console.log('io connect');
    io.emit('connectmsg');
    console.log('io sendte connectmsg');
  });

  io.on('connectmsg2', (socket) => {
    console.log('io mottok connectmsg2');
  });
  
  return io;
}

module.exports = io;