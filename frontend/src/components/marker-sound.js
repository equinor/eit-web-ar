import AFRAME from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:marker-sound");

AFRAME.registerComponent('marker-sound', {
  schema:  {
    src: { type: 'string', default: '' }
  },
  init: function () {
    log.info('init');
    this.el.addEventListener("markerFound", (e) => {
      log.info('marker found')
      this.el.components.sound.stopSound();
      this.el.components.sound.playSound();
    })
  }
});
