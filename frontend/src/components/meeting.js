import AFRAME, { THREE } from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:meeting");
import meeting from '../modules/meeting';

AFRAME.registerComponent('meeting', {
  init: function() {
    const registerProperties = {
      name: meeting.getRandomName(),
      color: meeting.getRandomColor()
    };
    meeting.registerUser(registerProperties, (response) => {
      log.info('I am now registered with name ' + response.name + ', id ' + response.userId);
      meeting.setMyUserId(response.userId);
      meeting.setUserProperties(response.userId, response);
      meeting.updateInfoBox();
      meeting.initMap();
      meeting.showMapHelper();
      meeting.connectSocket();
      
      // FOR TESTING
      if (window.location.href.indexOf('?testing') != -1) {
        var i = 0;
        var y = this.el.camera.rotation.y;
        var lat = Math.floor(Math.random() * 100);
        var lng = Math.floor(Math.random() * 100);
        //console.log('random latlng: ' + lat + ', ' + lng);
        setInterval(function() {
          let properties = {
            latitude: lat,
            longitude: lng,
            heading: (y + i * 2) % 360
          };
          
          meeting.setUserProperties(response.userId, properties);
          meeting.emitPosition(properties);
          
          i++;
        }, 50);
      }
      // ~FOR TESTING
      
      // Save and emit our own positions when receiving updated coordinated from gps
      window.addEventListener('gps-camera-update-position', function (e) {
        let heading = document.querySelector('a-camera').getAttribute('rotation').y;
        //console.log('Heading: ' + heading); //testing
        let properties = {
          latitude: e.detail.position.latitude,
          longitude: e.detail.position.longitude,
          heading: heading
        };
        meeting.setUserProperties(response.userId, properties);
        meeting.emitPosition(properties);
      });
      
      // Add entities for all registered users
      meeting.requestAllUsers(users => {
        for (let i = 0; i < users.length; i++) {
          let userId = users[i].userId;
          meeting.setUserProperties(userId, users[i]);
          if (userId != meeting.getMyUserId()) {
            meeting.addEntity(userId);
          }
        }
      });
      
      // Add entity each time a new user joins
      meeting.receiveUserJoined(data => {
        meeting.setUserProperties(data.userId, data);
        if (data.userId != meeting.getMyUserId()) {
          meeting.addEntity(data.userId);
        }
        console.log('received user-joined:');
        meeting.addMessage(`${meeting.getStyledName(data.userId)} joined!`);
      });
      
      // Fire a rocket when touching the screen
      document.addEventListener('touchstart', function(e) {
        meeting.sendRocket();
      });
      
    });
    
    // Save new positions when new positions are received from the server
    meeting.receivePositions(data => {
      for (let i = 0; i < data.length; i++) {
        const userId = data[i].userId;
        const properties = data[i];
        meeting.setUserProperties(userId, properties);
      }
    });
    
    // Move all entities to new positions when new positions are received from the server
    meeting.receivePositions(data => {
      for (let i = 0; i < data.length; i++) {
        const userId = data[i].userId;
        const latitude = data[i].latitude;
        const longitude = data[i].longitude;
        const rotation = data[i].heading;
        let findUserEl = document.querySelector(`[data-userId="${userId}"]`);
        if (findUserEl) {
          findUserEl.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
          findUserEl.setAttribute('rotation', `0 ${rotation} 0`);
        }
      }
    });
    
    // Update map when new positions are received from the server
    meeting.receivePositions(data => {
      meeting.initMap();
      for (let i = 0; i < data.length; i++) {
        const userId = data[i].userId;
        const latitude = data[i].latitude;
        const longitude = data[i].longitude;
        const color = meeting.getUserProperties(userId).color;
        meeting.addUserToMap(userId);
      }
    });
    
    // Receive various socket messages
    meeting.receiveUserLeft(data => {
      meeting.removeEntity(data.userId);
      console.log('received user-left');
      meeting.addMessage(`${meeting.getStyledName(data.userId)} left :(`);
    });
    meeting.receiveUserJoinedGroup(data => {
      console.log('received user-joined-group:');
      console.log(data);
    });
    meeting.receiveUserLeftGroup(data => {
      console.log('received user-left-group:');
      console.log(data);
    });
    meeting.receiveInteractionJoined(data => {
      console.log('received interaction-joined:');
      console.log(data);
      if (data.type == 'rocket') {
        meeting.addRocket(data);
      }
    });
    meeting.receiveInteractionLeft(data => {
      console.log('received interaction-left:');
      console.log(data);
    });
    meeting.receiveRocketHitUser(data => {
      console.log('received rocket-hit-user:');
      console.log(data);
      meeting.addMessage(`${meeting.getStyledName(data.fromUserId)} hit ${meeting.getStyledName(data.toUserId)}!`);
    });
    meeting.receiveAudioMessage(data => {
      console.log('received audio-message:');
      console.log(data);
      meeting.playAudio(data);
    });
    
    // Audio recording
    meeting.getRecorderElement().addEventListener('touchstart', function(e) {
      meeting.startRecording();
    });
  }
});