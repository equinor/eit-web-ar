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
      meeting.setUserProperties(response.userId, response); //?
      meeting.connectSocket();
      window.addEventListener('gps-camera-update-position', function (e) {
        meeting.emitPosition(e.detail.position.latitude, e.detail.position.longitude);
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
    
    meeting.receivePositions(data => {
      console.log('received position-update:');
      console.log(data);
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