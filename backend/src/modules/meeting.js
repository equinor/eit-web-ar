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

function _getSocketFromUser(userId) {
  const s = _sockets.find(s => s.userId == userId);
  return s.socket;
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
        storage.hexists(userHash, 'latitude0', (err, firstPositionExists) => {
          if (!firstPositionExists) {
            // Calculate initial fake position
            
            const fakeLatitude0 = 0;
            const fakeLongitude0 = 0;
            storage.hmset(userHash, 'latitude0', latitude, 'longitude0', longitude, 'fakeLatitude0', fakeLatitude0, 'fakeLongitude0', fakeLongitude0);
          }
        });
        storage.hmset(userHash, 'latitude', latitude, 'longitude', longitude);
      });
    });
    
    setInterval(function() {
      console.log('Send position-update to clients');
      
      if (_sockets.length < 1) {
        return;
      }
      
      // Get position of all users
      storage.smembers('users', (err, users) => {
        let multi = [];
        for (let i = 0; i < users.length; i++) {
          let userHash = utils.getUserHash(users[i]);
          multi.push(['hmget', userHash, 'latitude', 'longitude', 'latitude0', 'longitude0', 'fakeLatitude0', 'fakeLongitude0']);
        }
        storage.multi(multi).exec((err, positions) => {
          // Calculate relative positions
          console.log(positions);
          for (let i = 0; i < users.length; i++) {
            let a_userId = users[i];
            var a_latitude = positions[i][0];
            var a_longitude = positions[i][1];
            var a_fakeLatitude  = positions[i][0] - positions[i][2] + positions[i][4];
            var a_fakeLongitude = positions[i][1] - positions[i][3] + positions[i][5];
            let relativePositions = [];
            for (let j = 0; j < users.length; j++) {
              /*if (j == i) {
                continue;
              }*/
              let b_userId = users[j];
              let b_fakeLatitude = positions[j][0] - positions[j][2] + positions[j][4];
              let b_fakeLongitude = positions[j][1] - positions[j][3] + positions[j][5];
              let b_relativeLatitude = parseFloat(b_fakeLatitude) + parseFloat(a_latitude) - parseFloat(a_fakeLatitude);
              let b_relativeLongitude = parseFloat(b_fakeLongitude) + parseFloat(a_longitude) - parseFloat(a_fakeLatitude);
              relativePositions.push({
                userId: b_userId,
                latitude: b_relativeLatitude,
                longitude: b_relativeLongitude
              });
            }
            console.log(relativePositions);
            // Emit relative positions
            const socket = _getSocketFromUser(a_userId);
            socket.emit('position-update', relativePositions);
          }
        });
      });
    }, 1000);
  }
}