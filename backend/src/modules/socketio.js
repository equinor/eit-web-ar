const _socketio = require('socket.io');

module.exports =  {
  connect: function(server) {
    const io = _socketio(server);

    io.on('connect', (socket) => {
      console.log(`socket.io connect: ${socket.id}`);      
    });
    
    io.on('connect_error', (error) => {
      console.log('socket.io connect_error:');
      console.log(error);
    });
    
    io.on('connect_timeout', (error) => {
      console.log('socket.io connect_timeout:');
      console.log(error);
    });
    
    io.on('error', (error) => {
      console.log('socket.io error:');
      console.log(error);
    });
    
    io.on('disconnect', (error) => {
      console.log('socket.io disconnect:');
      console.log(error);
    });
    
    return io;
  }
}