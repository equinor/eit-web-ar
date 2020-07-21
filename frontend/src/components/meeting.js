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
      this.startEventListeners();
    });
  },
  startEventListeners: function() {
    console.log('startEventListeners');
    window.addEventListener('gps-camera-update-position', function (e) {
      console.log(e);
      meeting.emitPosition(e.detail.position.latitude, e.detail.position.longitude);
    });
    
    meeting.receivePositions(data => {
      console.log('received position-update:');
      console.log(data);
    })
  }
});