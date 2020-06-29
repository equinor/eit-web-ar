/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-rotation", {
    schema: {
      enabled: { default: true },
      rotationFactor: { default: 5 },
      rotationAxis: {default: 'y'} // Valid inputs: x, y, xy
    },
  
    init: function () {

      this.handleRotation = this.handleRotation.bind(this);
  
      this.isVisible = false;
  
      this.el.sceneEl.addEventListener("markerFound", (e) => {
        this.isVisible = true;
      });
  
      this.el.sceneEl.addEventListener("markerLost", (e) => {
        this.isVisible = false;
      });
    },
  
    update: function () {
      if (this.data.enabled) {
        this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
      } else {
        this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
      }
    },
  
    remove: function () {
      this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    },
  
    handleRotation: function (event) {
      if (this.isVisible) {
        if(this.data.rotationAxis == 'xy' || this.data.rotationAxis == 'y'){
            this.el.object3D.rotation.y += 
            event.detail.positionChange.x * this.data.rotationFactor;
        }
        if(this.data.rotationAxis == 'xy' || this.data.rotationAxis == 'x'){
            this.el.object3D.rotation.x += 
            event.detail.positionChange.x * this.data.rotationFactor;
        }
          
        //this.el.object3D.rotation.x +=
        //  event.detail.positionChange.y * this.data.rotationFactor;
      }
    },
  });
  