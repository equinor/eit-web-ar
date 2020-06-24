import AFRAME from "aframe";
import * as utils from "../modules/utils";

const log = utils.getLogger("components:location-based");

AFRAME.registerComponent('location-based', {
  schema: {
    place: { type: 'string', default: '{}' },
    numberOfDistanceMsgs: { type: 'number', default: '10' },
    loadPlacesInsideComponent: { type: 'string', default: 'false' },
  },

  init() {
    let data = this.data;

    if (data.loadPlacesInsideComponent === 'true') {
      const places = this.staticLoadPlaces();
      this.renderPlaces(places, data);
    } else {
      const places = [JSON.parse(data.place)];
      this.renderPlaces(places, data);
    }

    this.logDistance(data.numberOfDistanceMsgs);

    log.info('init done');
  },

  staticLoadPlaces() {
    return [
      {
        name: 'Magnemite',
        asset: '#magnemite',
        location: {
          lat: 59.964967,
          lng: 10.730272,
        },
      },
    ];
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async logDistance(maxMsgs) {
    await this.sleep(5000)
    let distanceMsg;
    for (let i = 0; i < maxMsgs; i++) {
      distanceMsg = document.querySelector('[gps-entity-place]').getAttribute('distancemsg');
      console.log(distanceMsg);
      await this.sleep(2000);
    }
  },

  renderPlaces(places, data) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
      let latitude = place.location.lat;
      let longitude = place.location.lng;

      let model = document.createElement('a-entity');
      model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
      model.setAttribute('gltf-model', place.asset);
      model.setAttribute('scale', '0.15 0.15 0.15');

      model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
      });

      scene.appendChild(model);
    });
  },

  update: function () {
  },

  remove: function () {
  },
});