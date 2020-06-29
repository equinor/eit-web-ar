import AFRAME from "aframe";

AFRAME.registerComponent('cursor-interactive', { 
  init: function () {
    const interactiveClass = 'cursor-interactive';

    this.el.classList.add(interactiveClass);
    var childEntities = this.el.getElementsByTagName('a-entity');
    for (var i = 0; i < childEntities.length; i++) {
      childEntities[i].classList.add(interactiveClass);
    }
  }
});
