var storage = require('./storage');
var utils = require('./utils');

const _emitPositionInterval = 1000;
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
  if (s === undefined) {
    return null;
  }
  return s.socket;
}

function _emitPositionUpdate() {  
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
      // Calculate relative/fake positions
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
        if (socket !== null) {
          socket.emit('position-update', relativePositions);
        }
      }
    });
  });
}

function _savePosition(userId, latitude, longitude) {
  const userHash = utils.getUserHash(userId);
  storage.hexists(userHash, 'latitude0', (err, initialPositionExists) => {
    if (!initialPositionExists) {      
      const latMeters = _random(-20, 20);
      const lngMeters = _random(-20, 20);
      const fakeLatitude0 = 0 + _latitudePlusMeters(0, latMeters);
      const fakeLongitude0 = 0 + _longitudePlusMeters(fakeLatitude0, 0, lngMeters);
      storage.hmset(userHash, 'latitude0', latitude, 'longitude0', longitude, 'fakeLatitude0', fakeLatitude0, 'fakeLongitude0', fakeLongitude0);
    }
  });
  storage.hmset(userHash, 'latitude', latitude, 'longitude', longitude);
}

function _addToSocketList(userId, socket) {
  _sockets.push({
    userId: userId,
    socket: socket
  });
}

function _latitudePlusMeters(latitude, meters) {
  // https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
  return latitude + (meters / 6371000) * (180 / Math.PI);
}

function _longitudePlusMeters(latitude, longitude, meters) {
  // https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
  return longitude + (meters / 6371000) * (180 / Math.PI) / Math.cos(latitude) * Math.PI/180;
}

function _random(min, max) {
  return Math.floor(Math.random() * max - min + 1) + min;
}

module.exports = {
  init: function(io) {
    _io = io;

    _io.on('connect', (socket) => {
      socket.on('disconnect', reason => {
        const userId = _getUserAtSocket(socket);
        this.removeUser(userId, (userId) => {
          this.emitUserLeft(userId);
        });
        console.log(`User ${userId} disconnected: ${reason}`);
      });
      
      socket.on('connect-socket-to-user', function(data) {
        const userId = data.userId;
        console.log(`connect-socket-to-user ${userId}`);
        _addToSocketList(userId, socket);
      });
      
      socket.on('position-update', data => {
        const latitude = data.latitude;
        const longitude = data.longitude;
        const userId = _getUserAtSocket(socket);
        console.log(`position-update: ${userId}: ${latitude}, ${longitude}`);
        _savePosition(userId, latitude, longitude);
      });
    });
    
    setInterval(function() {
      console.log('Send position-update to clients');
      _emitPositionUpdate();
    }, _emitPositionInterval);
  },

  emitUserLeft: function(userId) {
    const userHash = utils.getUserHash(userId);
    storage.hget(userHash, 'name', (err, name) => {
      _io.emit('user-left', {
        userId: userId,
        name: name
      });
    });
  },

  removeUser: function(userId, callback) {
    storage.srem('users', userId, (err, _) => {
      callback(userId);
    });
  }
}