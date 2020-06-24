import AFRAME, { THREE } from "aframe";

AFRAME.registerComponent('draw-line-click', {
  schema: {
    color: { type: 'string', default: '#f00' }
  },
  init: function() {
    this.startMarkerId = false;
    this.linesInfo = []; // { startMarkerId, material }

    // Create invisible plane for cursor events
    var planeEl = document.createElement('a-plane');
    planeEl.setAttribute('rotation', '-90 0 0');
    planeEl.setAttribute('material', 'opacity: 0.0');
    planeEl.classList.add('cursor-interactive');
    //planeEl.addClass('cursor-interactive'); //?
    this.el.appendChild(planeEl);

    // Listen for clicks on all draw-line-click-markers
    var emitters = this.el.sceneEl.querySelectorAll('[draw-line-click]');
    for (var i = 0; i < emitters.length; i++) {
      emitters[i].addEventListener('click', (e) => {
        if (e.detail.cursorEl == this.el.sceneEl) {
          // Click event called twice, do nothing.
        } else if (!this.startMarkerId) {
          // Store the start point of the line
          this.startMarkerId = e.target.parentEl.id;
        } else if (e.target.parentEl.id != this.el.id) {
          // This marker is not the end marker. Another instance of the ...
          // component will draw the line. Discard start and end points.
          this.startMarkerId = false;
        } else if (this.startMarkerId == this.el.id) {
          // User tries to draw a line from a marker to itself. Discard.
          this.startMarkerId = false;
        } else {
          // This marker is the end marker. Push the line to lines list.
          var material = new THREE.LineBasicMaterial({ color: this.data.color });
          this.linesInfo.push({
            startMarkerId: this.startMarkerId,
            material: material
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
        var points = [
          document.getElementById(this.linesInfo[i].startMarkerId).getAttribute('position'),
          this.el.getAttribute('position')
        ];
        var geometry = new THREE.BufferGeometry().setFromPoints(points);

        if (!line) {
          // Draw new line if it doesn't exist
          var line = new THREE.Line(geometry, this.linesInfo[i].material);
          line.name = 'draw-line-click-' + this.el.id + '-' + i;
          this.el.sceneEl.object3D.add(line);
          this.el.sceneEl.renderer.render(this.el.sceneEl, this.el.sceneEl.querySelector('a-camera').object3D);
        } else {
          // Update old line if it exists
          line.geometry = geometry;
        }
      }
    }
  }
})
