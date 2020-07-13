import AFRAME from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:gps-intersection");

AFRAME.registerComponent('gps-intersection', {
  dependencies: [
    'gps-entity-place'
  ],
  schema: {
    radius: { type: 'number', default: 1 },
    onlyInOut: { type: 'boolean', default: true }
  },
  init: function() {
    this.intersected = false;
    this.onlyInOut = (this.data.onlyInOut == true);
  },
  tick: function() {
    const distance = this.el.getAttribute('distance');
    var direction = '';
    //log.info(`${distance}`);

    // Discard if gps can't return distance
    if (distance === null) {
      return;
    }

    if (!this.intersected && distance <= this.data.radius) {
      // Entereing gps POI
      direction = 'in';
      this.emitIntersection(distance, direction);
      this.intersected = true;
    } else if (this.intersected && distance <= this.data.radius) {
      // Staying in gps POI
      if (!this.onlyInOut) {
        direction = 'stay';
        this.emitIntersection(distance, direction);
      }
    } else if (this.intersected && distance > this.data.radius) {
      // Exiting gps POI
      direction = 'out';
      this.emitIntersection(distance, direction);
      this.intersected = false;
    }
  },
  emitIntersection: function(distance, direction) {
    this.el.emit('gps-intersection', { distance: distance, direction: direction });
  }

});
