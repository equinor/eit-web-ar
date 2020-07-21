var storage = require('./storage');
var utils = require('./utils');

var _io = false;
var _sockets = [];

function _getUserAtSocket(socket) {
  for (let i = 0; i < _sockets.length; i++) {
    if (_sockets[i].socket == socket) {
      return _sockets[i].userId;
    }
  }
  return null;
}

module.exports = {
  init: function(io) {
    _io = io;

    _io.on('connect', (socket) => {      
      socket.on('connect-socket-to-user', function(data) {
        _sockets.push({
          userId: data.userId,
          socket: socket
        });
        console.log(`connect-socket-to-user ${data.userId}`);
      });
      
      socket.on('position-update', data => {
        const latitude = data.latitude;
        const longitude = data.longitude;
        const userId = _getUserAtSocket(socket);
        console.log(`position-update: ${userId}: ${latitude}, ${longitude}`);
        const userHash = utils.getUserHash(userId);
        storage.hmset(userHash, 'latitude', latitude, 'longitude', longitude);
      });
    });
  }
}