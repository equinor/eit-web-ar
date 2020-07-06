import AFRAME from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:animation-pauser");
var play = 1;

AFRAME.registerComponent('animation-pauser', {
  init: function() {
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