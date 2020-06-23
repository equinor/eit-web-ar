/* eslint-disable object-shorthand, prefer-arrow-callback, prefer-destructuring */
import AFRAME from "aframe";
import * as utils from "../modules/utils";

const log = utils.getLogger("components:toggle-visibility");

AFRAME.registerComponent('toggle-visibility', {
  schema: {
  },

  init() {
    const data = this.data; // schema properties
    const el = this.el; // <a-entity>
    const hoverOpacity = '0.9';
    let currentOpacity = el.getAttribute('material').opacity;

    el.setAttribute('material', 'transparent', 'false');

    el.addEventListener('click', function () {
      if (currentOpacity !== 0.0) {
        el.setAttribute('material', 'opacity: 0.0');
        currentOpacity = 0.0;
      } else if (currentOpacity !== 1.0) {
        el.setAttribute('material', 'opacity: 1.0');
        currentOpacity = 1.0;
      } else {
        el.setAttribute('material', 'opacity: 1.0');
        currentOpacity = 1.0;
      }
    });

    el.addEventListener('mouseenter', function () {
      if (currentOpacity !== 0.0) {
        el.setAttribute('material', 'opacity', hoverOpacity);
      }
    });

    el.addEventListener('mouseleave', function () {
      el.setAttribute('material', 'opacity', currentOpacity);
    });

    log.info("init done");
  },

  update: function () {
  },

  remove: function () {
  },
});