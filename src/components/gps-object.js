import AFRAME from "aframe";
import * as utils from "../modules/utils";

const log = utils.getLogger("components:gps-object");

// How to use: read user-guide.md

AFRAME.registerComponent('gps-object', {
  schema: {
    object: { type: 'string', default: '' },
    location: { type: 'string', default: '{}' },
    scale: { type: 'string', default: '1' },
    printDistance: { type: 'string', default: 'false' },
  },

  init() {
    let data = this.data;
    const object = data.object;
    const location = JSON.parse(data.location);
    const scale = data.scale;
    this.renderObject(object, location, scale);

    // logs the distance to the place/model in the console
    if (data.printDistance === 'true') {
      this.logDistance();
    }
  },

  // For logDistance function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Logs distance to place
  async logDistance() {
    await this.sleep(5000)
    let distance;
    const id = this.el.id;

    while (true) {
      distance = this.el.querySelector('[gps-entity-place]').getAttribute('distanceMsg');
      log.info(`${distance} to object with id ${id}.`);

      await this.sleep(2000);
    }
  },

  // Generate an entity which can be seen at the place's coordinates
  renderObject(object, location, scale) {
    let scene = this.el.sceneEl;

    let latitude = location.lat;
    let longitude = location.lng;

    let model = document.createElement('a-entity');
    model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
    model.setAttribute('gltf-model', object);
    model.setAttribute('scale', `${scale} ${scale} ${scale}`);

    this.el.appendChild(model);
  },

  update: function () {
  },

  remove: function () {
  },
});
