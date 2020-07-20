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

var name = '';
var userId = 0;

const socket = io(api.socketUri);
socket.on('connect', function(data){
  log.info('Socket.io connected :)');
});

module.exports = {
  registerUser: function (name, avatar, callback) {
    const regUrl = api.baseUri + '/user';

    const payload = {
      name: name,
      avatar: ''
    };

    axios({
      method: 'post',
      url: regUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: payload
    })
      .then((response) => {
        if (response.status == 201) {
          callback(response.data.userId);
          return true;
        } else {
          alert("Something went wrong when registering. See console.");
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  setName: function(name) {
    name = name;
  },
  setUserId: function(userId) {
    userId = userId;
  },
  emitPosition: function(latitude, longitude) {
    console.log('sender position-update til ');
    console.log(socket);
    /*socket.emit('position-update', {
      userId: userId,
      latitude: latitude,
      longitude: longitude
    });*/
    socket.emit('position-update');
  }
}