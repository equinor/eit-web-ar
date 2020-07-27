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
  color: '#f00',
  latitude: 0,
  longitude: 0,
  heading: 0
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
    let letters = 'aeiouyabcdefghijklmnopqrstuvwxyz';
    let name = '';
    for (let i = 0; i < 6; i++) {
      name += letters[Math.floor(Math.random() * 32)];
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
    // Enity
    let entity = document.createElement('a-entity');
    const geometry = this.getUserProperties(userId).geometry;
    const color = this.getUserProperties(userId).color;
    entity.setAttribute('data-userId', userId);
    entity.setAttribute('geometry', 'primitive', geometry);
    //entity.setAttribute('material', 'src', './images/smiley.png');
    entity.setAttribute('material', 'color', color);
    entity.setAttribute('scale', '0.5 0.5 0.5');
    document.querySelector('a-scene').appendChild(entity);
    
    // Text
    let text = document.createElement('a-text');
    text.setAttribute('value', this.getUserProperties(userId).name);
    text.setAttribute('position', '0 1.5 0');
    entity.appendChild(text);
    let text2 = document.createElement('a-text');
    text2.setAttribute('value', this.getUserProperties(userId).name);
    text2.setAttribute('position', '0 1.5 0');
    text2.setAttribute('rotation', '0 180 0');
    entity.appendChild(text2);
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
    //canvas.style.top  = - centerX / 2;
    //canvas.style.left = - centerY / 2;
    
    // Rotate map
    let heading = this.getUserProperties(this.getMyUserId()).heading;
    let originHeading = 0;
    if (document.querySelector('a-camera').components['gps-camera'].originCoords !== null) {
      originHeading = document.querySelector('a-camera').components['gps-camera'].originCoords.heading;
    }
    let rotation = heading;
    //console.log(heading);
    canvas.style.transform = `rotate(${rotation}deg)`;
    
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
    
    let size = 5;
    let centerX = 100;
    let centerY = 100;
    let scaleX = 500000;
    let scaleY = 500000;
    
    let myLat = this.getUserProperties(this.getMyUserId()).latitude;
    let myLng = this.getUserProperties(this.getMyUserId()).longitude;
    
    let relLat = lat - myLat + centerX;
    let relLng = lng - myLng + centerY;
    relLat += (relLat - centerX) * scaleX;
    relLng += (relLng - centerY) * scaleY;
    relLat = Math.floor(relLat);
    relLng = Math.floor(relLng);

    ctx.fillStyle = color;
    ctx.fillRect(relLat, relLng, size, size);
  },
  addUserToMap: function(userId) {
    let map = getMap();
    let canvas = map.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    
    let size = 5;
    let centerX = 100;
    let centerY = 100;
    let scaleX = 5;
    let scaleY = 5;
    let color = this.getUserProperties(userId).color;
    
    let x = document.querySelector(`[data-userId="${userId}"]`).getAttribute('position').x;
    let y = document.querySelector(`[data-userId="${userId}"]`).getAttribute('position').z;
    let relX = centerX + x * scaleX;
    let relY = centerY + y * scaleY;
    
    ctx.fillStyle = color;
    ctx.fillRect(relX, relY, size, size);
  },
  showMapHelper: function() {
    let mapHelper = document.getElementById('mapHelper');
    mapHelper.innerText = 'You →';
    setTimeout(function() { mapHelper.classList.add('fadeOut') }, 5000);
  },
  updateInfoBox: function() {
    let infoBox = document.getElementById('info');
    infoBox.innerText = 'You are ' + this.getUserProperties(this.getMyUserId()).name;
    //infoBox.style.color = this.getUserProperties(this.getMyUserId()).color;
  },
  addMessage: function(text) {
    let messagesContainer = document.getElementById('messages');
    let messages = messagesContainer.querySelectorAll('.message');
    let message = document.createElement('span');
    message.classList.add('message');
    message.innerText = text;
    setTimeout(function() { message.classList.add('fadeOut'); }, 5000);
    messagesContainer.appendChild(message);
    
    if (messages.length > 9) {
      messagesContainer.removeChild(messages[0]);
    }
  }
}