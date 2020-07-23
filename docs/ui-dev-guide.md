# UI dev guide

## UI toggle buttons

### GPS user input (epic2, epic2.5)
To access the user input from the UI wrap, use the following code in your javascript.

Add event listener for when the user submits gps coords manually:
``` 
    document.getElementById('submit_gps_coords').addEventListener('click', () => {
      const lat = document.getElementById('lat_pos').value;
      const lng = document.getElementById('lng_pos').value;
    });
```

Add event listener for when the user wants to use the current location:
```
    document.getElementById('submit_current_position').addEventListener('click', () => {

      let camera = document.querySelector('a-camera');
      camera.addEventListener('loaded', () => {
        if (this.camera.hasAttribute('gps-camera')) {
          var gpsCamera = this.camera.components['gps-camera'];
        } else if (this.camera.hasAttribute('kalman-gps-camera')) {
          var gpsCamera = this.camera.components['kalman-gps-camera'];
        } else if (this.camera.hasAttribute('standstill-gps-camera')) {
          var gpsCamera = this.camera.components['standstill-gps-camera'];
        } else if (this.camera.hasAttribute('set-gps-camera')) {
          var gpsCamera = this.camera.components['set-gps-camera'];
        }

        var currentPos = gpsCamera.currentCoords;

        // var lat = currentPos.latitude
        // var lng = curentPos.longitude
      })
    });
```