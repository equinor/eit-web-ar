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
        meeting.setUserProperties(users[i].userId, users[i]);
      }
    });
    
    meeting.receivePositions(data => {
      console.log('received position-update:');
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const userId = data[i].userId;
        if (meeting.getUserProperties(userId) === undefined) break;
        const latitude = data[i].latitude;
        const longitude = data[i].longitude;
        let findUserEl = document.querySelector(`[data-userId="${userId}"]`);
        if (!findUserEl) {
          console.log('Appending ' + userId + ' entity.');
          let userEl = document.createElement('a-entity');
          const geometry = meeting.getUserProperties(userId).geometry;
          const color = meeting.getUserProperties(userId).color;
          userEl.setAttribute('data-userId', userId);
          userEl.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
          userEl.setAttribute('geometry', 'primitive', geometry);
          userEl.setAttribute('material', 'color', color);
          userEl.setAttribute('scale', '0.3 0.3 0.3');
          document.querySelector('a-scene').appendChild(userEl);
        } else {
          findUserEl.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        }
      }
    });
    
    meeting.receiveUserJoined(data => {
      console.log('received user-joined:');
      meeting.setUserProperties(data.userId, data);
      console.log(meeting.getUserProperties(data.userId));
    });
    meeting.receiveUserLeft(data => {
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