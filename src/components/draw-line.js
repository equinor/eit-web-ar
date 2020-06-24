import AFRAME, { THREE } from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:draw-line");

AFRAME.registerComponent('draw-line', {
  schema: {},
  init: function () {
    // Maintain a list of active markers
    this.markersVisible = [];
    this.el.sceneEl.addEventListener('markerFound', (e) => {
      if (!this.markersVisible.includes(e.target.id)) {
        this.markersVisible.push(e.target.id);
        console.log(this.markersVisible);
      }
    });
    this.el.sceneEl.addEventListener('markerLost', (e) => {
      for (var i = 0; i < this.markersVisible.length; i++) {
        if (e.target.id == this.markersVisible[i]) {
          this.markersVisible.pop(i);
          break;
        }
      }
      console.log(this.markersVisible);
    });
  },
  tick: function () {
    if (this.markersVisible.length > 1) {
      var material = new THREE.LineBasicMaterial( { color: '#f00' } );
      var points = [];
      for (var i = 0; i < this.markersVisible.length; i++) {
        var markerId = this.markersVisible[i];
        points.push(document.getElementById(markerId).getAttribute('position'));
      }
      var geometry = new THREE.BufferGeometry().setFromPoints(points);
      var line = new THREE.Line(geometry, material);
      this.el.sceneEl.object3D.add(line);
      this.el.sceneEl.renderer.render(this.el.sceneEl, this.el.sceneEl.querySelector('a-camera').object3D);
    }
  }
});
