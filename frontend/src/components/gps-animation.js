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

    if (data.from == '' || data.to == '') {
      // calculate to and from coords
      let fromLocationLat = this.el.components['gps-entity-place'].data.latitude; // Eller gps-object position?
      let fromLocationLng = this.el.components['gps-entity-place'].data.longitude;
      let toLocationLat = (parseFloat(fromLocationLat) + parseFloat(this.getRandomSgnTimes(0.0001))).toFixed(6);
      let toLocationLng = (parseFloat(fromLocationLng) + parseFloat(this.getRandomSgnTimes(0.0001))).toFixed(6);
      // add animation component
      this.el.setAttribute('animation', {
        property: data.property,
        // from: `{ "lat": ${fromLocationLat}, "lng": ${fromLocationLng} }`,
        to: `{ "lat": ${toLocationLat}, "lng": ${toLocationLng} }`,
        dir: data.dir,
        loop: data.loop,
        dur: data.dur,
        startEvents: data.startEvents,
      });
    } else {
      this.el.setAttribute('animation', {
        property: data.property,
        from: data.from,
        to: data.to,
        dir: data.dir,
        loop: data.loop,
        dur: data.dur,
        startEvents: data.startEvents,
      });
    }

    this.el.addEventListener('animationcomplete', () => {
      let newLocation = {
        lat: this.el.components['gps-entity-place'].data.latitude,
        lng: this.el.components['gps-entity-place'].data.longitude,
      };
      this.updateAnimationPosition(newLocation);
    });
  },
  getRandomSgnTimes: function(base) {
    let sgn;
    if (Math.random() <= 0.5) {
      sgn = -1;
    } else {
      sgn = 1;
    }
    return (sgn*base);
  },
  updateAnimationPosition: function (newLocation) {
    let toLocationLat = parseFloat(newLocation.lat) + parseFloat(this.getRandomSgnTimes(0.0001));
    let toLocationLng = parseFloat(newLocation.lng) + parseFloat(this.getRandomSgnTimes(0.0001));
    this.el.setAttribute('animation', {
      // from: `{ "lat": ${newLocation.lat}, "lng": ${newLocation.lng} }`,
      to: `{ "lat": ${toLocationLat}, "lng": ${toLocationLng} }`,
    });
  },
  update: function (oldData) {
    // // Skip if it's the first update (right after init)
    // if (oldData === undefined) {
    //   return;
    // }
    // // Update the position of the gps-entity-place each time the animation update the values
    // var newLat = this.data.split(' ')[0];
    // var newLng = this.data.split(' ')[1];

    // this.el.components['gps-entity-place'].data.latitude = newLat;
    // this.el.components['gps-entity-place'].data.longitude = newLng;
    // this.el.components['gps-entity-place']._updatePosition();
  }
});
