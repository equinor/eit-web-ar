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

function getPointAtHeading(x0, y0, heading, distance) {
  let x = x0 - distance * Math.sin(deg2rad(heading));
  let y = y0 - distance * Math.cos(deg2rad(heading));
  return [x, y];
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
  receiveRocketJoined: function(callback) {
    socket.on('rocket-joined', data => {
      callback(data);
    });
  },
  receiveRocketLeft: function(callback) {
    socket.on('rocket-left', data => {
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
  appendEyes: function(entity) {
    let eye = document.createElement('a-entity');
    eye.setAttribute('geometry', 'primitive', 'sphere');
    eye.setAttribute('material', 'color', '#00f');
    eye.setAttribute('scale', '0.1 0.1 0.1');
    eye.setAttribute('position', '0.6 0.6 -0.6');
    entity.appendChild(eye);
    
    let eye2 = document.createElement('a-entity');
    eye2.setAttribute('geometry', 'primitive', 'sphere');
    eye2.setAttribute('material', 'color', '#00f');
    eye2.setAttribute('scale', '0.1 0.1 0.1');
    eye2.setAttribute('position', '-0.6 0.6 -0.6');
    entity.appendChild(eye2);
      
    return entity;
  },
  addEntity: function(userId) {
    console.log('Adding entity for user ' + userId);
    // Enity
    let entity = document.createElement('a-entity');
    const geometry = this.getUserProperties(userId).geometry;
    const color = this.getUserProperties(userId).color;
    entity.setAttribute('data-userId', userId);
    entity.setAttribute('geometry', 'primitive', geometry);
    this.appendEyes(entity);
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
    
    if (document.querySelector(`[data-userId="${userId}"]`) === undefined) return;
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
  },
  sendRocket: function() {
    let lat = this.getUserProperties(this.getMyUserId()).latitude;
    let lng = this.getUserProperties(this.getMyUserId()).longitude;
    let heading = this.getUserProperties(this.getMyUserId()).heading;
    let color = this.getUserProperties(this.getMyUserId()).color;
    console.log('Send rocket from (' + lat + ', ' + lng + ') with heading ' + heading);
    
    let properties = {
      type: 'rocket',
      latitude: lat,
      longitude: lng,
      heading: heading,
      color: color
    }
    const rocketUrl = api.baseUri + '/rocket';
    axios({
      method: 'post',
      url: rocketUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: properties
    })
      .then((response) => {
        if (response.status == 201) {
          return true;
        } else {
          console.log('Error with post /rocket');
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  addRocket: function(properties) {
    let latitude = properties.latitude;
    let longitude = properties.longitude;
    let heading = properties.heading;
    let color = properties.color;
    let distance = 20;
    console.log('Adding rocket from (' + latitude + ', ' + longitude + ') with heading ' + heading + ', distance ' + distance);
    
    let entity = document.createElement('a-entity');
    const geometry = 'sphere';
    entity.setAttribute('data-rocketId', properties.rocketId);
    entity.setAttribute('geometry', 'primitive', geometry);
    entity.setAttribute('material', 'color', color);
    entity.setAttribute('scale', '0.1 0.1 0.1');
    entity.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
    entity.setAttribute('rotation', `0 ${heading} 0`);
    document.querySelector('a-scene').appendChild(entity);
    let position0 = [
      entity.getAttribute('position').x,
      entity.getAttribute('position').z
    ];
    let position1 = getPointAtHeading(position0[0], position0[1], heading, distance);
    console.log('Rocket going from: ' + position0 + ' --> ' + position1);
    entity.setAttribute('animation', `property: position; from: ${position0[0]} 0 ${position0[1]}; to: ${position1[0]} 0 ${position1[1]}; loop: false; dur: 3000; autoplay: true;`);
    
  }
}