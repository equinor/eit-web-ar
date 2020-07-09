import AFRAME from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:gps-sound");

AFRAME.registerComponent('gps-sound', {
  dependencies: [
    'cursor-interactive'
  ],
  schema:  {
    src: { type: 'string', default: '' }
  },
  init: function () {
    log.info('init');
    this.el.addEventListener('click', (e) => {
      log.info('POI found')
      this.el.components.sound.stopSound();
      this.el.components.sound.playSound();
    })
  }
});
