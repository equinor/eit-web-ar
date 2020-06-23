import AFRAME from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:show-modal");

AFRAME.registerComponent('show-modal', {
  schema: {
    modalId: { type: 'string', default: '' }
  },
  init: function () {
    var modalShown = false;
    this.el.addEventListener("markerFound", (e) => {
      log.info('marker found');

      if (!modalShown) {
        var modalEl = document.getElementById(this.data.modalId).cloneNode(true);
        modalEl.id = '';
        modalEl.style.width = '90%';
        modalEl.style.height = '90%';
        modalEl.style.position = 'fixed';
        modalEl.style.top = '0';
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
  }
});
