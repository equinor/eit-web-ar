import AFRAME from "aframe";

AFRAME.registerComponent('cursor-interactive', {
  schema: {
    addToChildren: { type: 'string', default: 'true' }
  },
  init: function () {
    this.initDone = false;
  },
  tock: function () {
    if (!this.initDone) {
      const interactiveClass = 'cursor-interactive';
      this.el.classList.add(interactiveClass);
      if (this.data.addToChildren === 'true') {
        var children = this.el.children;
        for (var i = 0; i < children.length; i++) {
          children[i].classList.add(interactiveClass);
        }
        this.initDone = true;
      }
    }
  }
});
