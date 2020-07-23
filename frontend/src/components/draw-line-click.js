import AFRAME, { THREE } from "aframe";

AFRAME.registerComponent('draw-line-click', {
  dependencies: [
    'cursor-interactive'
  ],
  schema: {
    offset: { type: 'vec3', default: {x: 0, y: 0, z: 0} },
    color: { type: 'string', default: '#f00' },
    linewidth: { type: 'number', default: 6 },
    linecap: { type: 'string', default: 'round' },
    linejoin: { type: 'string', default: 'round' }
  },
  init: function() {
    this.startMarkerId = false;
    this.linesInfo = []; // { startMarkerId, material }

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: this.data.color,
      linewidth: this.data.linewidth,
      linecap: this.data.linecap,
      linejoin: this.data.linejoin
    });

    // Create invisible plane for cursor events
    var planeEl = document.createElement('a-plane');
    planeEl.setAttribute('rotation', '-90 0 0');
    planeEl.setAttribute('material', 'opacity: 0.0');
    planeEl.setAttribute('id', this.el.id); // litt jallamekk
    this.el.appendChild(planeEl);

    // Listen for clicks on all draw-line-click-markers
    var emitters = this.el.sceneEl.querySelectorAll('[draw-line-click]');
    for (var i = 0; i < emitters.length; i++) {
      emitters[i].addEventListener('click', (e) => {
        if (e.detail.cursorEl == this.el.sceneEl) {
          // Click event called twice, do nothing.
        } else if (!this.startMarkerId) {
          // Store the start point of the line
          this.startMarkerId = e.target.id;
        } else if (e.target.id != this.el.id) {
          // This marker is not the end marker. Another instance of the ...
          // component will draw the line. Discard start and end points.
          this.startMarkerId = false;
        } else if (this.startMarkerId == this.el.id) {
          // User tries to draw a line from a marker to itself. Discard.
          this.startMarkerId = false;
        } else {
          // This marker is the end marker. Push the line to lines list.
          this.linesInfo.push({
            startMarkerId: this.startMarkerId,
            material: this.lineMaterial
          });
          this.startMarkerId = false;
        }
      });
    }
  },
  tick: function () {
    for (var i = 0; i < this.linesInfo.length; i++) {
      var line = this.el.sceneEl.object3D.getObjectByName('draw-line-click-' + this.el.id + '-' + i);
      // If one of the markers are not visible, remove the line
      if (!document.getElementById(this.linesInfo[i].startMarkerId).object3D.visible || !this.el.object3D.visible) {
        if (line) {
          this.el.sceneEl.object3D.remove(line);
          continue;
        }
      } else  {
        // If all markers are visible, draw/update the line

        // Calculate relative offset
        var startEl = document.getElementById(this.linesInfo[i].startMarkerId);
        var startPosition = startEl.getAttribute('position');
        var endPosition   = this.el.getAttribute('position');
        var startOffset   = startEl.getAttribute('draw-line-click').offset;
        startOffset       = new THREE.Vector3(startOffset.x, startOffset.y, startOffset.z);
        var endOffset     = this.data.offset;
        endOffset         = new THREE.Vector3(endOffset.x, endOffset.y, endOffset.z);
        var startQuaternion = startEl.object3D.quaternion;
        startOffset.applyQuaternion(startQuaternion);
        var endQuaternion = this.el.object3D.quaternion;
        endOffset.applyQuaternion(endQuaternion);

        var startPoint = startPosition.add(startOffset);
        var endPoint   = endPosition.add(endOffset);
        var points = [
          startPoint,
          endPoint
        ];
        var geometry = new THREE.BufferGeometry().setFromPoints(points);

        if (!line) {
          // Draw new line if it doesn't exist
          var line = new THREE.Line(geometry, this.linesInfo[i].material);
          line.name = 'draw-line-click-' + this.el.id + '-' + i;
          this.el.sceneEl.object3D.add(line);
          this.el.sceneEl.renderer.render(this.el.sceneEl.object3D, this.el.sceneEl.camera);
        } else {
          // Update old line if it exists
          line.geometry = geometry;
        }
      }
    }
  }
})
