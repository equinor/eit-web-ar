import AFRAME from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:animation-pauser");

AFRAME.registerComponent('animation-pauser', {
  dependencies: [
    'cursor-interactive',
    'animation-mixer'
  ],
  init: function() {
    var play = 1;
    this.el.addEventListener('click', function(e) {
      if (play == 0){
        this.setAttribute('animation-mixer', {timeScale: 1});
        play = 1;
      } else {
        this.setAttribute('animation-mixer', {timeScale: 0});
        play = 0;
      }
    });
  }
});