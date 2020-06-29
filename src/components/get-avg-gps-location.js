import AFRAME from "aframe";
import * as utils from "../modules/utils";

const log = utils.getLogger("components:get-avg-gps-location");

// How to use: read user-guide.md

// TODO:
// * How to log?
// * User guide

AFRAME.registerComponent('get-avg-gps-location', {
  schema: {
    gpsPointsCount: { type: 'number', default: 15 },
    positionAverage: { type: 'vec2', default: {latitude: 0, longitude: 0} },
    positionArray: { type: 'array', default: [] },
    logConsole: { type: 'string', default: 'true' },
  },

  init() {
    this.positionCount = 0;
    this.data.positionArray = [];
    this.data.positionAverage = {};

    // Add event listener
    window.addEventListener('gps-camera-update-position', (e) => {
      if (this.positionCount < this.data.gpsPointsCount) {
        this.storeGpsPosition(e.detail.position);
      }
    });

    log.info('init done');
  },

  storeGpsPosition(position) {
    // Add current position to array
    this.data.positionArray.push([position.latitude, position.longitude]);

    // Calculate average of current positions in array
    let latAvg = 0;
    let lngAvg = 0;
    for (let i = 0; i < this.data.positionArray.length; i += 1) {
      latAvg += this.data.positionArray[i][0];
      lngAvg += this.data.positionArray[i][1];
      if (i + 1 === this.data.positionArray.length) {
        latAvg /= this.data.positionArray.length;
        lngAvg /= this.data.positionArray.length;
      }
    }

    // lage en array med average positions, nøyaktig til 6 desimaler
    this.data.positionAverage.latitude = latAvg.toFixed(6);
    this.data.positionAverage.longitude = lngAvg.toFixed(6);
    this.positionCount += 1;

    // Log to console if setting is set to true
    if (this.data.logConsole === 'true') {
      console.log(this.el.getAttribute('get-avg-gps-location').positionAverage);
    }
  },

  update: function () {
  },

  remove: function () {
  },
});