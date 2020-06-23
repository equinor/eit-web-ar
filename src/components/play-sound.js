import AFRAME from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:play-sound");

AFRAME.registerComponent('play-sound', {
  schema:  {
    file: { type: 'string', default: './audio/messageReceived.mp3' }
  },
  init: function () {
    log.info('play-sound init');
    this.el.addEventListener("markerFound", (e) => {
      log.info('marker found')
      var audio = new Audio(this.file);
      audio.play();
    })
  }
});
