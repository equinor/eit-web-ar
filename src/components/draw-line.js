import AFRAME, { THREE } from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:draw-line");

AFRAME.registerComponent('draw-line', {
  schema: {},
  init: function () {
    this.markersVisible = [];
    this.el.sceneEl.addEventListener('markerFound', (e) => {
      this.markersVisible.push(e.target);

      if (this.markersVisible.length > 2) {
        //draw lines
        console.log(this.markersVisible[0]);
        console.log(this.markersVisible[0].getAttribute('position'));

        var material = new THREE.LineBasicMaterial( { color: '#f00' } );
        var points = [
          this.markersVisible[0].getAttribute('position'),
          this.markersVisible[1].getAttribute('position'),
          this.markersVisible[2].getAttribute('position')
        ];
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(geometry, material);
        this.el.sceneEl.object3D.add(line);
        renderer.render(this.el.sceneEl, this.el.sceneEl.querySelector('camera'))
        console.log(this.markersVisible);
      }
    });

  }/*,
  update: function() {
    log.info('init');
    this.el.addEventListener('markerFound', (e) => {
      log.info('marker found');
      // loop through all markers and draw lines
      var markers = document.querySelectorAll('a-marker');
      var markersVisible = [];

      for (var i = 0; i < markers.length; i++) {
        if (markers[i].object3D.visible) {
          // todo: skip this marker
          markersVisible.push(markers[i]);
        }
      }
      console.log(markersVisible);
    });
  }*/
});
