import AFRAME, { THREE } from "aframe";
import * as utils from "../modules/utils";
const log = utils.getLogger("components:test-box");

// Test component to make sure silly code works

AFRAME.registerComponent('test-box', {
   schema: {
      width: { type: 'number', default: 1 },
      height: { type: 'number', default: 1 },
      depth: { type: 'number', default: 1 },
      color: { type: 'color', default: '#AAA' }
   },

   init: function () {
      var data = this.data;
      var el = this.el;
      this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);
      this.material = new THREE.MeshStandardMaterial({ color: data.color });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      el.setObject3D('mesh', this.mesh);

      log.info("init done");
   },

   /**
    * Update the mesh in response to property updates.
    */
   update: function (oldData) {
      var data = this.data;
      var el = this.el;

      // If `oldData` is empty, then this means we're in the initialization process.
      // No need to update.
      if (Object.keys(oldData).length === 0) { return; }

      // Geometry-related properties changed. Update the geometry.
      if (data.width !== oldData.width ||
         data.height !== oldData.height ||
         data.depth !== oldData.depth) {
         el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(data.width, data.height,
            data.depth);
      }

      // Material-related properties changed. Update the material.
      if (data.color !== oldData.color) {
         el.getObject3D('mesh').material.color = new THREE.Color(data.color);
      }
   },

   remove: function () {
      this.el.removeObject3D('mesh');
   },

   events: {
      "model-loaded": function (e) {
         log.info("Picked up model-loaded for" + e.target.id);
      }
   }
});