const socketio = require('socket.io');

function io(server) {
  const io = socketio(server);

  io.on('connect', (socket) => {
    console.log('io connect');
    io.emit('connectmsg');
    console.log('io sendte connectmsg');
    
    socket.on('position-update', (data) => {
      console.log('position-update');
      console.log(data);
    });
  });
  
  io.on('connect_error', (error) => {
    console.log('connect_error');
    console.log(error);
  });
  
  io.on('connect_timeout', (error) => {
    console.log('connect_timeout');
    console.log(error);
  });
  
  io.on('error', (error) => {
    console.log('error');
    console.log(error);
  });
  
  io.on('disconnect', (error) => {
    console.log('disconnect');
    console.log(error);
  });
  
  return io;
}

module.exports = io;