const axios = require('axios');
const io = require('socket.io-client');
const utils = require('./utils');
const log = utils.getLogger("components:meeting");

function getApiUri() {
  let dockerUri = `http://${window.location.hostname}:3100/meetapi`;
  let productionUri = `https://${window.location.hostname}/meetapi`;
  
  if (window.location.hostname.indexOf("localhost") > -1) {
    return dockerUri;
  } else {
    return productionUri;
  }
}
function getSocketUri() {
  let dockerUri = `http://${window.location.hostname}:3100`;
  let productionUri = `https://${window.location.hostname}`;
  
  if (window.location.hostname.indexOf("localhost") > -1) {
    return dockerUri;
  } else {
    return productionUri;
  }
}

const api = {
  baseUri: getApiUri(),
  socketUri: getSocketUri()
}

const defaultUserProperties = {
  userId: 0,
  name: 'DefaultName',
  geometry: 'sphere',
  color: '#f00'
}
var userProperties = [];
var myUserId;

const socket = io(api.socketUri);
socket.on('connect', function(data){
  log.info('Socket.io connected :)');
});

module.exports = {
  registerUser: function (properties, callback) {
    const regUrl = api.baseUri + '/user';

    axios({
      method: 'post',
      url: regUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: properties
    })
      .then((response) => {
        if (response.status == 201) {
          callback(response.data);
          return true;
        } else {
          console.log('Error with post /user');
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  setMyUserId: function(userId) {
    myUserId = userId;
  },
  getMyUserId: function() {
    return myUserId;
  },
  setUserProperties: function(userId, properties) {
    userProperties[userId] = {};
    Object.assign(userProperties[userId], properties);
    for (let [key, value] of Object.entries(defaultUserProperties)) {
      if (!userProperties[userId].hasOwnProperty(key)) {
        userProperties[userId][key] = value;
      }
    }
  },
  getUserProperties: function(userId) {
    return userProperties[userId];
  },
  connectSocket: function() {
    socket.emit('connect-socket-to-user', {
      userId: myUserId
    });
  },
  emitPosition: function(latitude, longitude) {
    //console.log('sender position-update til ');
    //console.log(socket);
    socket.emit('position-update', {
      latitude: latitude,
      longitude: longitude
    });
  },
  receivePositions: function(callback) {
    socket.on('position-update', data => {
      callback(data);
    });
  },
  receiveUserJoined: function(callback) {
    socket.on('user-joined', data => {
      callback(data);
    });
  },
  receiveUserLeft: function(callback) {
    socket.on('user-left', data => {
      callback(data);
    });
  },
  receiveUserJoinedGroup: function(callback) {
    socket.on('user-joined-group', data => {
      callback(data);
    });
  },
  receiveUserLeftGroup: function(callback) {
    socket.on('user-left-group', data => {
      callback(data);
    });
  },
  getRandomColor: function() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  getRandomName: function() {
    let letters = 'abcdefghijklmnopqrstuvwxyz';
    let name = '';
    for (let i = 0; i < 6; i++) {
      name += letters[Math.floor(Math.random() * 26)];
    }
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return name;
  },
  requestAllUsers: function(callback) {
    const regUrl = api.baseUri + '/users';

    axios({
      method: 'get',
      url: regUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if (response.status == 200) {
          callback(response.data);
          return true;
        } else {
          console.log('Error with get /users');
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}