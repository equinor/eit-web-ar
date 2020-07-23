import AFRAME from "aframe";
import * as utils from "../modules/utils";

const log = utils.getLogger("components:gps-object");

// How to use: read user-guide.md

AFRAME.registerComponent('gps-object', {
  schema: {
    object: { type: 'string', default: '' },
    location: { type: 'string', default: '{ "lat": 60.631533, "lng": 6.417439 }' },
    offset: { type: 'boolean', default: false },
    printDistance: { type: 'boolean', default: false },
    scale: { type: 'string', default: '' },
  },

  init() {
    let data = this.data;
    const object = data.object;
    let location = JSON.parse(data.location);
    
    this.camera = document.querySelector('a-camera');
    this.camera.addEventListener('loaded', () => {
      if (this.camera.hasAttribute('gps-camera')) {
        this.gpsCamera = this.camera.components['gps-camera'];
      } else if (this.camera.hasAttribute('kalman-gps-camera')) {
        this.gpsCamera = this.camera.components['kalman-gps-camera'];
      } else if (this.camera.hasAttribute('standstill-gps-camera')) {
        this.gpsCamera = this.camera.components['standstill-gps-camera'];
      } else if (this.camera.hasAttribute('set-gps-camera')) {
        var gpsCamera = this.camera.components['set-gps-camera'];
      }
      if (data.offset) {
        location.lat += this.addOffset(0.0001);
        location.lng += this.addOffset(0.0001);
      }
      this.renderObject(object, location);

      let animation = this.el.components['gps-animation'];
      if (animation) {
        this.el.components['gps-animation'].updateAnimationPosition(location);
      }
    })
    
    // logs the distance to the place/model in the console
    if (data.printDistance == true) {
      this.logDistance();
    }

    // When submitting gps coordinations through the app, do the following:
    document.getElementById('submit_gps_coords').addEventListener('click', () => {
      // Get submitted coords
      const lat = document.getElementById('lat_pos').value;
      const lng = document.getElementById('lng_pos').value;
      
      // Put element at the submitted coords
      this.location = { "lat": lat, "lng": lng }
      if (data.offset) {
        this.location.lat += this.addOffset(0.0001);
        this.location.lng += this.addOffset(0.0001);
      }
      this.renderObject(object, this.location);
      // Update animation component
      let animation = this.el.components['gps-animation'];
      if (animation) {
        this.el.components['gps-animation'].updateAnimationPosition(this.location);
      }
    });

    // When submitting your current gps position, do the following:
    document.getElementById('submit_current_position').addEventListener('click', () => {
      // Get current position
      var currentPos = this.gpsCamera.currentCoords;
      this.location = { "lat": currentPos.latitude, "lng": currentPos.longitude }
      if (data.offset) {
        this.location.lat += this.addOffset(0.0001);
        this.location.lng += this.addOffset(0.0001);
      }
      this.renderObject(object, this.location);
      // Set input fields to current pos
      document.getElementById('lat_pos').value = currentPos.latitude;
      document.getElementById('lng_pos').value = currentPos.longitude;
      // Update animation component
      let animation = this.el.components['gps-animation'];
      if (animation) {
        this.el.components['gps-animation'].updateAnimationPosition(this.location); // DENNE MÅ HA OFFSET
      }
    });
    log.info('init done');
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
      distance = this.el.getAttribute('distanceMsg');
      log.info(`${distance} to object with id ${id}.`);

      await this.sleep(2000);
    }
  },

  // Generate an entity which can be seen at the place's coordinates
  renderObject: function (object, location) {
    if (object[0] == '#') {
      this.el.setAttribute('gltf-model', object);
    } else if (object == '') {
      this.el.setAttribute('geometry', 'primitive: box');
    } else {
      this.el.setAttribute('geometry', `primitive: ${object}`);
    }

    if (this.el.data.scale != '') {
      let scale = this.el.data.scale;
      this.el.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }

    let latitude = location.lat;
    let longitude = location.lng;
    
    this.el.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
    if (this.gpsCamera && this.gpsCamera.originCoords != null) {
      this.el.components['gps-entity-place']._updatePosition();
    }
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

  update: function (oldData) {
    if (oldData.location != this.data.location) {
      const data = this.data;
      const object = data.object;
      const location = JSON.parse(data.location);
      this.renderObject(object, location);
    }
  },

  remove: function () {
  },
});
