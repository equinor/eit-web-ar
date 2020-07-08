/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-scale", {
    schema: {
      enabled: { default: true },
      minScale: { default: 0.3 },
      maxScale: { default: 8 },
    },
  
    init: function () {
      this.handleScale = this.handleScale.bind(this);
  
      this.initialScale = this.el.object3D.scale.clone();
      this.scaleFactor = 1;
    },
  
    update: function () {
      if (this.data.enabled) {
        this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
      } else {
        this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
      }
    },
  
    remove: function () {
      this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    },
  
    handleScale: function (event) {
      if (this.el.object3D.visible) {
        this.scaleFactor *=
          1 + event.detail.spreadChange / event.detail.startSpread;
  
        this.scaleFactor = Math.min(
          Math.max(this.scaleFactor, this.data.minScale),
          this.data.maxScale
        );
  
        this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
        this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
        this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
      }
    },
  });
  