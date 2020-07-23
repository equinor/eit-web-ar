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
      meeting.connectSocket();
      
      // FOR TESTING
      if (window.location.href.indexOf('?testing') != -1) {
        let properties = {
          latitude: 1,
          longitude: 1,
          heading: this.el.camera.rotation.y
        };
        meeting.setUserProperties(response.userId, properties);
        meeting.emitPosition(properties);
      }
      // ~FOR TESTING
      
      window.addEventListener('gps-camera-update-position', function (e) {
        let heading = document.querySelector('a-camera').getAttribute('rotation').y;
        let properties = {
          latitude: e.detail.position.latitude,
          longitude: e.detail.position.longitude,
          heading: heading
        };
        meeting.setUserProperties(response.userId, properties);
        meeting.emitPosition(properties);
      });
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
        let findUserEl = document.querySelector(`[data-userId="${userId}"]`);
        if (findUserEl) {
          findUserEl.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
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
        meeting.addPointToMap(latitude, longitude, color);
      }
    });
    
    meeting.receiveUserJoined(data => {
      meeting.setUserProperties(data.userId, data);
      if (data.userId != meeting.getMyUserId()) {
        meeting.addEntity(data.userId);
      }
      console.log('received user-joined:');
      console.log(properties);
    });
    meeting.receiveUserLeft(data => {
      meeting.removeEntity(data.userId);
      console.log('received user-left:');
      console.log(data);
    });
    meeting.receiveUserJoinedGroup(data => {
      console.log('received user-joined-group:');
      console.log(data);
    });
    meeting.receiveUserLeftGroup(data => {
      console.log('received user-left-group:');
      console.log(data);
    });
  }
});