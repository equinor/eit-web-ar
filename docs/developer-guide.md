# Developer guide

## COMPONENT: location-based.js
Add the location-based tag to the scene element, together with its properties. For example:

<a-scene arjs location-based='place: {"name": "Magnemite", "asset": "#magnemite", "location": {"lat": 59.964967, "lng":10.730272}}; numberOfDistanceMsgs: 10; loadPlacesInsideComponent: false'>>

* name: just enter a title for the place you want to add.
* asset: write the asset id code for your model.
* location: enter lat and lng coordinates.
* numberOfDistanceMsgs: how many times you will see the distance to the entity with coordinates you added.
* loadPlacesInsideComponent: You can enter your place(s) inside the components javascript file instead of in the scene tag.

Make sure to add your model as an asset:
<a-assets>
    <a-asset-item
        id="magnemite"
        src="./gltf/magnemite/scene.gltf"
        preload="auto">
    </a-asset-item>
</a-assets>


## COMPONENT: get-avg-gps-location

* Put get-avg-gps-location in the camera tag, like this:
<a-camera gps-camera rotation-reader get-avg-gps-location>
    <a-entity
        cursor="fuse: false"
        raycaster="interval: 20; objects: .cursor-interactive"
        position="0 0 -1"
        geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.015"
        material="color: black; shader: flat"
    ></a-entity>
</a-camera>

* Available options (with default values):
<a-camera ... get-avg-gps-location="gpsPointsCount: 15; logConsole: true">

* Get current average position:
<script>
 document.querySelector('[get-avg-gps-location]').getAttribute('get-avg-gps-location').positionAverage
</script>

### COMPONENT: gesture-detector

* Emit events for detected gestures
Add to a-scene tag: <a-scene gesture-detector>

* For making your own gesture-components catch events with:
sceneEl.addEventListener("onefingermove".. 
sceneEl.addEventListener("twofingermove"..
sceneEl.addEventListener("threefingermove"..

### COMPONENT: gesture-rotation

* Add this gesture to an entity to be able to rotate it with a one-finger gesture

Inputs: 
- rotationAxis: choose what axis the object is able to rotate about, valid inputs: x, y, xy

### COMPONENT: gesture-scale

* Add this gesture to an entity to be able to scale it with a two-finger gesture