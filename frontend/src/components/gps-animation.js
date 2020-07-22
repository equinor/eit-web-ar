import AFRAME from "aframe"

AFRAME.registerComponent('gps-animation', {
  dependencies: [
    'gps-object',
  ],
  schema: {
    property: { type: 'string', default: 'gps-object.location' },
    from: { type: 'string', default: '' },
    to: { type: 'string', default: '' },
    loop: { type: 'boolean', default: false },
    dur: { type: 'int', default: 1000 },
    dir: { type: 'string', default: 'alternate'},
    startEvents: {},
  },
  init: function () {
    const data = this.data;

    this.el.setAttribute('animation', {
      property: data.property,
      loop: data.loop,
      dur: data.dur,
      startEvents: data.startEvents,
    });

    this.el.addEventListener('animationcomplete', () => {
      let newLocation = {
        lat: this.el.components['gps-entity-place'].data.latitude,
        lng: this.el.components['gps-entity-place'].data.longitude,
      };
      console.log('animationcomplete')
      this.updateAnimationPosition(newLocation);
    });
  },
  addOffset: function(base) {
    let sgn;
    if (Math.random() <= 0.5) {
      sgn = -1;
    } else {
      sgn = 1;
    }
    return (sgn*base);
  },
  updateAnimationPosition: function (newLocation) {
    let toLocationLat = (parseFloat(newLocation.lat) + parseFloat(this.addOffset(0.0001))).toFixed(6);
    let toLocationLng = (parseFloat(newLocation.lng) + parseFloat(this.addOffset(0.0001))).toFixed(6);
    this.el.setAttribute('animation', {
      from: `{ "lat": ${newLocation.lat}, "lng": ${newLocation.lng} }`,
      to: `{ "lat": ${toLocationLat}, "lng": ${toLocationLng} }`,
    });
  },
  update: function () {
  }
});
