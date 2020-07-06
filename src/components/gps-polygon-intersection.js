import AFRAME from "aframe";

AFRAME.registerComponent('gps-polygon-intersection', {
  schema: {
    polygon: { type: 'string', default: '' },
    keepEmitting: { type: 'boolean', default: false }
  },
  init: function() {
    var polygon = JSON.parse(this.data.polygon);
    var keepEmitting = this.data.keepEmitting;
    var el = this.el;
    var pointInsidePolygon = this.pointInsidePolygon;
    var emitIntersection = this.emitIntersection;

    var wasInside = false;
    window.addEventListener('gps-camera-update-position', function (e) {
      var currentPosition = e.detail.position;
      var point = { lat: e.detail.position.latitude, lng: e.detail.position.longitude };

      var inside = pointInsidePolygon(point, polygon);

      if (!wasInside && inside) {
        // User was outside, now inside the polygon
        el.emit('gps-polygon-intersection', { direction: 'in' });
        wasInside = true;
      } else if (wasInside && !inside) {
        // User was inside, now outside of the polygon
        el.emit('gps-polygon-intersection', { direction: 'out' });
        wasInside = false;
      } else if (wasInside && inside && keepEmitting) {
        // User was inside, and is still inside the polygon
        el.emit('gps-polygon-intersection', { direction: 'stay' });
      }
    });
  },
  pointInsidePolygon: function(point, polygon) {
    // Stolen from https://stackoverflow.com/questions/22521982/check-if-point-is-inside-a-polygon
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i].lat, yi = polygon[i].lng;
      var xj = polygon[j].lat, yj = polygon[j].lng;

      var intersect = ((yi > point.lng) != (yj > point.lng))
        && (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }
});