/* eslint-disable object-shorthand, func-names, prefer-arrow-callback */
import AFRAME from "aframe";

AFRAME.registerComponent('markerhandler', {
  init: function () {
    const animatedMarker = document.querySelector('#animated-marker');
    const aEntity = document.querySelector('#animated-model');

    // every click the model grows
    animatedMarker.addEventListener('click', function (ev, target) {
      const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
      if (aEntity && intersectedElement === aEntity) {
        const scale = aEntity.getAttribute('scale');
        Object.keys(scale).forEach(key => scale[key] = scale[key] + 1);
        aEntity.setAttribute('scsale', scale);
      }
    });
  },
});
