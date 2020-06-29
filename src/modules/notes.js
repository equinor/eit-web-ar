// GPS CAMERA
_updatePosition: function () {
    // don't update if accuracy is not good enough
    if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
        if (this.data.alert && !document.getElementById('alert-popup')) {
            var popup = document.createElement('div');
            popup.innerHTML = 'GPS signal is very poor. Try move outdoor or to an area with a better signal.'
            popup.setAttribute('id', 'alert-popup');
            document.body.appendChild(popup);
        }
        return;
    }

    var alertPopup = document.getElementById('alert-popup');
    if (this.currentCoords.accuracy <= this.data.positionMinAccuracy && alertPopup) {
        document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
        // first camera initialization
        this.originCoords = this.currentCoords;
        this._setPosition();

        var loader = document.querySelector('.arjs-loader');
        if (loader) {
            loader.remove();
        }
        window.dispatchEvent(new CustomEvent('gps-camera-origin-coord-set'));
    } else {
        this._setPosition();
    }
}

// ENTITY
_updatePosition: function() {
    var position = { x: 0, y: this.el.getAttribute('position').y || 0, z: 0 }

    // update position.x
    var dstCoords = {
        longitude: this.data.longitude,
        latitude: this._cameraGps.originCoords.latitude,
    };

    position.x = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords);

    this._positionXDebug = position.x;

    position.x *= this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1;

    // update position.z
    var dstCoords = {
        longitude: this._cameraGps.originCoords.longitude,
        latitude: this.data.latitude,
    };

    position.z = this._cameraGps.computeDistanceMeters(this._cameraGps.originCoords, dstCoords);

    position.z *= this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1;

    if (position.y !== 0) {
        var altitude = this._cameraGps.originCoords.altitude !== undefined ? this._cameraGps.originCoords.altitude : 0;
        position.y = position.y - altitude;
    }

    // update element's position in 3D world
    this.el.setAttribute('position', position);
}

// GPS CAMERA
// * Calculates distance from original coords to current coords and sets position
_setPosition: function () {
    var position = this.el.getAttribute('position');

    // compute position.x
    var dstCoords = {
        longitude: this.currentCoords.longitude,
        latitude: this.originCoords.latitude,
    };

    position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.x *= this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

    // compute position.z
    var dstCoords = {
        longitude: this.originCoords.longitude,
        latitude: this.currentCoords.latitude,
    }

    position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.z *= this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

    // update position
    this.el.setAttribute('position', position);

    window.dispatchEvent(new CustomEvent('gps-camera-update-position', { detail: { position: this.currentCoords, origin: this.originCoords } }));
}

// For GPS CAMERA
computeDistanceMeters: function (src, dest, isPlace) {
    var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
    var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

    var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = angle * 6378160;

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the caller
    if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
        return Number.MAX_SAFE_INTEGER;
    }

    // if function has been called for a place, and if it's too far and a max distance has been set,
    // return max distance possible - to be handled by the caller
    if (isPlace && this.data.maxDistance && this.data.maxDistance > 0 && distance > this.data.maxDistance) {
        return Number.MAX_SAFE_INTEGER;
    }

    return distance;
}

// PROJECTED GPS CAMERA
_setPosition: function () {
    var position = this.el.getAttribute('position');

    var worldCoords = this.latLonToWorld(this.currentCoords.latitude, this.currentCoords.longitude);

    position.x = worldCoords[0];
    position.z = worldCoords[1]; 

    // update position
    this.el.setAttribute('position', position);

    // add the sphmerc position to the event (for testing only)
    window.dispatchEvent(new CustomEvent('gps-camera-update-position', { detail: { position: this.currentCoords, origin: this.originCoordsProjected } }));
}

latLonToWorld: function(lat, lon) {
    var projected = this._project (lat, lon);
    // Sign of z needs to be reversed compared to projected coordinates
    return [ projected[0] - this.originCoordsProjected[0], -(projected[1] - this.originCoordsProjected[1]) ];
}

_project: function (lat, lon) {
    const HALF_EARTH = 20037508.34;

    // Convert the supplied coords to Spherical Mercator (EPSG:3857), also
    // known as 'Google Projection', using the algorithm used extensively 
    // in various OpenStreetMap software.
    var y = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
    return [ (lon / 180.0) * HALF_EARTH, y * HALF_EARTH / 180.0 ];
}

// GPS PROJECTED ENTITY
// set position to world coords using the lat/lon 
_updatePosition: function() {
    var worldPos = this._cameraGps.latLonToWorld(this.data.latitude, this.data.longitude);
    var position = this.el.getAttribute('position');

    // update element's position in 3D world
    //this.el.setAttribute('position', position);
    this.el.setAttribute('position', {
        x: worldPos[0],
        y: position.y, 
        z: worldPos[1]
    }); 
}