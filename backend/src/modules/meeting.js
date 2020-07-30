var storage = require('./storage');
var utils = require('./utils');

const _emitPositionInterval = 50;
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
      multi.push(['hmget', userHash, 'latitude', 'longitude', 'latitude0', 'longitude0', 'fakeLatitude0', 'fakeLongitude0', 'heading']);
    }
    storage.multi(multi).exec((err, positions) => {
      // Calculate relative/fake positions
      //console.log('All positions:');
      //console.log(positions);
      
      for (let i = 0; i < users.length; i++) {
        if (positions[i][0] === null) continue;
        
        let a_userId = users[i];
        var a_latitude = positions[i][0];
        var a_longitude = positions[i][1];
        var a_fakeLatitude  = positions[i][0] - positions[i][2] + positions[i][4];
        var a_fakeLongitude = positions[i][1] - positions[i][3] + positions[i][5];
        let relativePositions = [];
        for (let j = 0; j < users.length; j++) {
          if (j == i) continue;
          if (positions[j][0] === null) continue;
          
          let b_userId = users[j];
          let b_fakeLatitude = positions[j][0] - positions[j][2] + positions[j][4];
          let b_fakeLongitude = positions[j][1] - positions[j][3] + positions[j][5];
          let b_relativeLatitude = parseFloat(b_fakeLatitude) + parseFloat(a_latitude) - parseFloat(a_fakeLatitude);
          let b_relativeLongitude = parseFloat(b_fakeLongitude) + parseFloat(a_longitude) - parseFloat(a_fakeLongitude);
          let b_heading = positions[j][6];
          
          relativePositions.push({
            userId: b_userId,
            latitude: b_relativeLatitude,
            longitude: b_relativeLongitude,
            heading: b_heading
          });
        }
        //console.log('Positions relative to ' + a_userId);
        //console.log(relativePositions);
        
        const socket = _getSocketFromUser(a_userId);
        if (socket === null) continue;
        if (relativePositions.length == 0) continue;
        socket.emit('position-update', relativePositions);
      }
    });
  });
}

function _savePosition(userId, latitude, longitude, heading) {
  const userHash = utils.getUserHash(userId);
  storage.hexists(userHash, 'latitude0', (err, initialPositionExists) => {
    if (!initialPositionExists) {      
      const latMeters = _random(-20, 20);
      const lngMeters = _random(-20, 20);
      //console.log('random: ' + latMeters + ', ' + lngMeters);
      const fakeLatitude0 = 0 + _latitudePlusMeters(0, latMeters);
      const fakeLongitude0 = 0 + _longitudePlusMeters(fakeLatitude0, 0, lngMeters);
      storage.hmset(userHash, 'latitude0', latitude, 'longitude0', longitude, 'fakeLatitude0', fakeLatitude0, 'fakeLongitude0', fakeLongitude0);
    }
  });
  if (heading !== null) {
    storage.hmset(userHash, 'heading', heading);
  }
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
  return Math.floor(Math.random() * (max - min) + 1) + min;
}

module.exports = {
  init: function(io) {
    _io = io;

    _io.on('connect', (socket) => {
      socket.on('disconnect', reason => {
        const userId = _getUserAtSocket(socket);
        if (userId === null) return;
        this.removeUser(userId, (userId) => {
          this.emitUserLeft(userId);
        });
        //console.log(`User ${userId} disconnected: ${reason}`);
      });
      
      socket.on('connect-socket-to-user', function(data) {
        const userId = data.userId;
        //console.log(`connect-socket-to-user ${userId}`);
        _addToSocketList(userId, socket);
      });
      
      socket.on('position-update', data => {
        const latitude = data.latitude;
        const longitude = data.longitude;
        const heading = data.heading;
        const userId = _getUserAtSocket(socket);
        //console.log(`position-update: ${userId}: ${latitude}, ${longitude} - ${heading}`);
        _savePosition(userId, latitude, longitude, heading);
      });
      
      socket.on('rocket-hit-user', data => {
        this.emitRocketHitUser(data);
      });
      
      socket.on('audio-message', data => {
        this.emitAudioMessage(data);
      });
    });
    
    setInterval(function() {
      _emitPositionUpdate();
    }, _emitPositionInterval);
  },
  
  emitAudioMessage: function(data) {
    _io.emit('audio-message', data);
  },
  
  emitRocketHitUser: function(data) {
    _io.emit('rocket-hit-user', data);
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
  },

  emitInteractionJoined: function(interactionId, properties) {
    if (_sockets.length < 1) {
      return;
    }
    
    // Get position of all users
    storage.smembers('users', (err, users) => {
      let multi = [];
      for (let i = 0; i < users.length; i++) {
        let userHash = utils.getUserHash(users[i]);
        multi.push(['hmget', userHash, 'latitude', 'longitude', 'latitude0', 'longitude0', 'fakeLatitude0', 'fakeLongitude0', 'heading']);
      }
      storage.multi(multi).exec((err, positions) => {        
        let fromUserKey = Object.keys(users).find(key => users[key] == properties.fromUserId);
        let r_fakeLatitude = positions[fromUserKey][0] - positions[fromUserKey][2] + positions[fromUserKey][4];
        let r_fakeLongitude = positions[fromUserKey][1] - positions[fromUserKey][3] + positions[fromUserKey][5];
        
        for (let i = 0; i < users.length; i++) {
          if (positions[i][0] === null) continue;
          
          let a_userId = users[i];
          var a_latitude = positions[i][0];
          var a_longitude = positions[i][1];
          var a_fakeLatitude  = positions[i][0] - positions[i][2] + positions[i][4];
          var a_fakeLongitude = positions[i][1] - positions[i][3] + positions[i][5];
          
          let r_relativeLatitude = parseFloat(r_fakeLatitude) + parseFloat(a_latitude) - parseFloat(a_fakeLatitude);
          let r_relativeLongitude = parseFloat(r_fakeLongitude) + parseFloat(a_longitude) - parseFloat(a_fakeLongitude);
          
          properties.latitude = r_relativeLatitude;
          properties.longitude = r_relativeLongitude;
          
          const socket = _getSocketFromUser(a_userId);
          if (socket === null) continue;
          socket.emit('interaction-joined', properties);
        }
      });
    });
  }
}