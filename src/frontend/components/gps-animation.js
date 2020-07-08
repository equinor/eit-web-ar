import AFRAME from "aframe"

AFRAME.registerComponent('gps-animation', {
  dependencies: [
    'gps-entity-place',
    'animation'
  ],
  schema: {
    type: 'string',
    default: ''
  },
  update: function (oldData) {
    // Skip if it's the first update (right after init)
    if (oldData === undefined) {
      return;
    }
    // Update the position of the gps-entity-place each time the animation update the values
    var newLat = this.data.split(' ')[0];
    var newLng = this.data.split(' ')[1];

    this.el.components['gps-entity-place'].data.latitude = newLat;
    this.el.components['gps-entity-place'].data.longitude = newLng;
    this.el.components['gps-entity-place']._updatePosition();
  }
});
