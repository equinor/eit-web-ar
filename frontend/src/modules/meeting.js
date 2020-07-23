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

function getMap() {
  let map = document.getElementById('map');
  return map;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
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
    if (typeof(userProperties[userId]) === 'object') {
      Object.assign(userProperties[userId], properties);
    } else {
      userProperties[userId] = {};
      Object.assign(userProperties[userId], properties);
      for (let [key, value] of Object.entries(defaultUserProperties)) {
        if (!userProperties[userId].hasOwnProperty(key)) {
          userProperties[userId][key] = value;
        }
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
  emitPosition: function(properties) {
    socket.emit('position-update', properties);
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
  },
  addEntity: function(userId) {
    console.log('Adding entity for user ' + userId);
    let entity = document.createElement('a-entity');
    const geometry = this.getUserProperties(userId).geometry;
    const color = this.getUserProperties(userId).color;
    entity.setAttribute('data-userId', userId);
    entity.setAttribute('geometry', 'primitive', geometry);
    entity.setAttribute('material', 'color', color);
    entity.setAttribute('scale', '0.5 0.5 0.5');
    document.querySelector('a-scene').appendChild(entity);
  },
  removeEntity: function(userId) {
    let entity = document.querySelector(`[data-userId="${userId}"]`);
    if (entity !== null) {
      entity.parentNode.removeChild(entity);
    }
  },
  initMap: function() {
    let map = getMap();
    let canvas = map.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    
    // Clear map
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale, move, rotate
    const centerX = 100;
    const centerY = 100;
    canvas.style.top  = - centerX / 2;
    canvas.style.left = - centerY / 2;
    
    // Rotate map
    //console.log('heading: ' + this.getUserProperties(this.getMyUserId()).heading);
    //let heading = this.getUserProperties(this.getMyUserId()).heading;
    //canvas.style.transform = `rotate(${heading}deg)`;
    
    // Add this user to the map
    const lat = this.getUserProperties(this.getMyUserId()).latitude;
    const lng = this.getUserProperties(this.getMyUserId()).longitude;
    const color = this.getUserProperties(this.getMyUserId()).color;
    this.addPointToMap(lat, lng, color);
  },
  addPointToMap: function(lat, lng, color) {
    let map = getMap();
    let canvas = map.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    
    const size = 5;
    const centerX = 100;
    const centerY = 100;
    const scaleX = 500000;
    const scaleY = 500000;
    
    const myLat = this.getUserProperties(this.getMyUserId()).latitude;
    const myLng = this.getUserProperties(this.getMyUserId()).longitude;
    
    let relLat = lat - myLat + centerX;
    let relLng = lng - myLng + centerY;
    relLat += (relLat - centerX) * scaleX;
    relLng += (relLng - centerY) * scaleY;
    //console.log('('+relLat+', '+relLng+') before floor');
    relLat = Math.floor(relLat);
    relLng = Math.floor(relLng);
    //console.log('Added point ('+relLat+', '+relLng+') to the map');
    ctx.fillStyle = color;
    ctx.fillRect(relLat, relLng, 5, 5);
  }
}