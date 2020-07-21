import AFRAME, { THREE } from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:meeting");
import meeting from '../modules/meeting';

AFRAME.registerComponent('meeting', {
  init: function() {
    const _this = this;
    const name = 'testing'
    meeting.registerUser(name, '', (userId) => {
      log.info('User registered with name ' + name + ' and id ' + userId);
      meeting.setName(name);
      meeting.setUserId(userId);
      this.startEmittingPosition();
    });
    
    meeting.receivePositions(data => {
      //console.log('received position-update:');
      //console.log(data);
    });
    
    meeting.receiveUserJoined(data => {
      console.log('received user-joined:');
      console.log(data);
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
  },
  startEmittingPosition: function() {
    window.addEventListener('gps-camera-update-position', function (e) {
      meeting.emitPosition(e.detail.position.latitude, e.detail.position.longitude);
    });
  }
});