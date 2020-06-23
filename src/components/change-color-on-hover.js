/* eslint-disable object-shorthand, prefer-arrow-callback, prefer-destructuring */
import AFRAME from "aframe";
// import * as utils from "../modules/utils";
// const log = utils.getLogger("components:test-box");


AFRAME.registerComponent('change-color-on-hover', {
  schema: {
    color: { default: 'red' },
  },

  init: function () {
    let data = this.data;
    let el = this.el;  // <a-box>
    let defaultColor = el.getAttribute('material').color;
    console.log("hejhipp");

    el.addEventListener('mouseenter', function () {
      el.setAttribute('color', data.color);
    });

    el.addEventListener('mouseleave', function () {
      el.setAttribute('color', defaultColor);
    });
  },
});
