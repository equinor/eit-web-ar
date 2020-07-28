import AFRAME, { THREE } from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:meeting");
import meeting from '../modules/meeting';

AFRAME.registerComponent('meeting', {
  init: function() {
    const _this = this;
    const properties = {
      name: meeting.getRandomName(),
      color: meeting.getRandomColor()
    };
    meeting.registerUser(properties, (response) => {
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
        console.log('random latlng: ' + lat + ', ' + lng);
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
      // Red: 270 deg/-90 deg (10, 0)
      let entity1 = document.createElement('a-entity');
      entity1.setAttribute('geometry', 'primitive', 'sphere');
      entity1.setAttribute('material', 'color', '#f00');
      entity1.setAttribute('scale', '0.1 0.1 0.1');
      entity1.setAttribute('position', '10 0 0');
      document.querySelector('a-scene').appendChild(entity1);
      // Green: 180 deg (0, 10)
      let entity2 = document.createElement('a-entity');
      entity2.setAttribute('geometry', 'primitive', 'sphere');
      entity2.setAttribute('material', 'color', '#0f0');
      entity2.setAttribute('scale', '0.1 0.1 0.1');
      entity2.setAttribute('position', '0 0 10');
      document.querySelector('a-scene').appendChild(entity2);
      // Blue: 90 deg (-10, 0)
      let entity3 = document.createElement('a-entity');
      entity3.setAttribute('geometry', 'primitive', 'sphere');
      entity3.setAttribute('material', 'color', '#00f');
      entity3.setAttribute('scale', '0.1 0.1 0.1');
      entity3.setAttribute('position', '-10 0 0');
      document.querySelector('a-scene').appendChild(entity3);
      // Grey: 0 deg (0, -10)
      let entity4 = document.createElement('a-entity');
      entity4.setAttribute('geometry', 'primitive', 'sphere');
      entity4.setAttribute('material', 'color', '#aaa');
      entity4.setAttribute('scale', '0.1 0.1 0.1');
      entity4.setAttribute('position', '0 0 -10');
      document.querySelector('a-scene').appendChild(entity4);
      // ~FOR TESTING
      
      window.addEventListener('gps-camera-update-position', function (e) {
        let heading = document.querySelector('a-camera').getAttribute('rotation').y;
        console.log('Heading: ' + heading); //testing
        let properties = {
          latitude: e.detail.position.latitude,
          longitude: e.detail.position.longitude,
          heading: heading
        };
        meeting.setUserProperties(response.userId, properties);
        meeting.emitPosition(properties);
      });
      
      meeting.requestAllUsers(users => {
        for (let i = 0; i < users.length; i++) {
          let userId = users[i].userId;
          meeting.setUserProperties(userId, users[i]);
          if (userId != meeting.getMyUserId()) {
            meeting.addEntity(userId);
          }
        }
      });
      
      meeting.receiveUserJoined(data => {
        meeting.setUserProperties(data.userId, data);
        if (data.userId != meeting.getMyUserId()) {
          meeting.addEntity(data.userId);
        }
        console.log('received user-joined:');
        meeting.addMessage(`${data.name} joined!`)
      });
      
      document.addEventListener('touchstart', function(e) {
        meeting.sendRocket();
      });
      
    });
    
    // Save new positions
    meeting.receivePositions(data => {
      for (let i = 0; i < data.length; i++) {
        const userId = data[i].userId;
        const properties = data[i];
        meeting.setUserProperties(userId, properties);
      }
    });
    
    // Update 3d position
    meeting.receivePositions(data => {
      for (let i = 0; i < data.length; i++) {
        const userId = data[i].userId;
        const latitude = data[i].latitude;
        const longitude = data[i].longitude;
        const rotation = data[i].heading;
        let findUserEl = document.querySelector(`[data-userId="${userId}"]`);
        if (findUserEl) {
          findUserEl.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
          findUserEl.setAttribute('rotation', `0 ${rotation} 0`)
        }
      }
    });
    
    // Update map
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
    meeting.receiveUserLeft(data => {
      meeting.removeEntity(data.userId);
      console.log('received user-left');
      meeting.addMessage(`${data.name} left :(`)
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
  }
});