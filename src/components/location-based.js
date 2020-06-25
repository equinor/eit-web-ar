import AFRAME from "aframe";
import * as utils from "../modules/utils";

const log = utils.getLogger("components:location-based");

// How to use: read user-guide.md

// TODO:
// * Add functionality to multiple places

AFRAME.registerComponent('location-based', {
  schema: {
    place: { type: 'string', default: '{}' },
    numberOfDistanceMsgs: { type: 'number', default: 10 },
    loadPlacesInsideComponent: { type: 'string', default: 'false' },
  },

  init() {
    let data = this.data;

    // Use a place from staticLoadPlaces (see below) or from the component properties (from index.html)
    if (data.loadPlacesInsideComponent === 'true') {
      const places = this.staticLoadPlaces();
      this.renderPlaces(places, data);
    } else {
      const places = [JSON.parse(data.place)];
      this.renderPlaces(places, data);
    }

    // logs the distance to the place/model in the console
    this.logDistance(data.numberOfDistanceMsgs);

    log.info('init done');
  },

  // Load one a place from inside this component, instead of entering it in index.html
  // To use, set loadPlacesInsideComponent to 'true'. 
  staticLoadPlaces() {
    return [
      {
        name: 'Eric',
        asset: '#magnemite',
        location: {
          lat: 59.965020,
          lng: 10.730031,
        },
      },
    ];
  },

  // For logDistance function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Logs distance to place
  async logDistance(maxMsgs) {
    await this.sleep(5000)
    let distanceMsg;
    for (let i = 0; i < maxMsgs; i++) {
      distanceMsg = document.querySelector('[gps-entity-place]').getAttribute('distancemsg');
      console.log(distanceMsg);

      await this.sleep(2000);
    }
  },

  // Generate an entity which can be seen at the place's coordinates
  renderPlaces(places, data) {
    let scene = this.el.sceneEl;

    places.forEach((place) => {
      let latitude = place.location.lat;
      let longitude = place.location.lng;

      let model = document.createElement('a-entity');
      model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
      model.setAttribute('gltf-model', place.asset);
      model.setAttribute('scale', '1 1 1');

      scene.appendChild(model);

      let gpsCameraEntity = this.el.sceneEl.querySelector('[gps-camera]');

      gpsCameraEntity.addEventListener('gps-camera-update-position', (e) => {
        console.log('////////');
        console.log(e);
        console.log('////////');
      });
    });
  },

  update: function () {
  },

  remove: function () {
  },
});