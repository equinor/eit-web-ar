import AFRAME from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:show-modal");

AFRAME.registerComponent('show-modal', {
  dependencies: [
    'cursor-interactive'
  ],
  schema: {
    modalId: { type: 'string', default: '' },
    trigger: { type: 'string', default: 'markerFound' }
  },
  init: function () {
    log.info('s-m init');
    // Create invisible plane for cursor events
    var planeEl = document.createElement('a-plane');
    planeEl.setAttribute('rotation', '-90 0 0');
    planeEl.setAttribute('material', 'opacity: 0.0');
    this.el.appendChild(planeEl);

    var modalShown = false;
    var triggeredOnce = false;

    this.el.addEventListener(this.data.trigger, (e) => {
      // Quickfix to skip the first mouseenter event
      if (this.data.trigger == 'mouseenter' && !triggeredOnce) {
        triggeredOnce = true;
        return;
      }

      log.info('modal triggered with ' + this.data.trigger);

      if (!modalShown) {
        var modalEl = document.getElementById(this.data.modalId).cloneNode(true);
        modalEl.id = '';
        modalEl.style.width = '90%';
        modalEl.style.height = '90%';
        modalEl.style.position = 'fixed';
        modalEl.style.top = '5%';
        modalEl.style.left = '5%';
        modalEl.style.background = 'white';
        modalEl.style.padding = '20px';
        modalEl.onclick = function() {
          this.parentElement.removeChild(modalEl);
          modalShown = false;
        };
        document.body.appendChild(modalEl);
        modalShown = true;
      }
    });
    log.info('s-m init done');
  }
});
