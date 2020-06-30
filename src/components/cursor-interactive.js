import AFRAME from "aframe";

AFRAME.registerComponent('cursor-interactive', {
  init: function () {
    console.log('init');
    const interactiveClass = 'cursor-interactive';

    this.el.classList.add(interactiveClass);

    var children = this.el.children;
    for (var i = 0; i < children.length; i++) {
      children[i].classList.add(interactiveClass);
    }
  }

});
