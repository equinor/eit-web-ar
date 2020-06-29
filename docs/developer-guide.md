# Developer guide

## COMPONENT: gps-object.js
Add the gps-object tag to an entity, together with its properties. For example:

```html
<a-entity
  gps-object='object: #magnemite; location: { "lat": 54.959941, "lng": 12.701367 }; scale: 0.1; printDistance: true'>
</a-entity>
```

* object: reference to the asset containing the model you want to show.
* location: enter lat and lng coordinates on the format '{ "lat": latitude, "lng": longitude }'.
* scale: scaling of the model. Default is 1.
* printDistance: Whether the component should keep printing the distance from the camera to the object. 'true' or 'false'. Default is 'false'.

Make sure to add your model as an asset:

```html
<a-assets>
    <a-asset-item
        id="magnemite"
        src="./gltf/magnemite/scene.gltf"
        preload="auto">
    </a-asset-item>
</a-assets>
```

## COMPONENT: get-avg-gps-location

* Put get-avg-gps-location in the camera tag, like this:

```html
<a-camera gps-camera rotation-reader get-avg-gps-location>
    <a-entity
        cursor="fuse: false"
        raycaster="interval: 20; objects: .cursor-interactive"
        position="0 0 -1"
        geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.015"
        material="color: black; shader: flat"
    ></a-entity>
</a-camera>
```

* Available options (with default values):

```html
<a-camera ... get-avg-gps-location="gpsPointsCount: 15; logConsole: true">
```

* Get current average position:

```html
<script>
 document.querySelector('[get-avg-gps-location]').getAttribute('get-avg-gps-location').positionAverage
</script>
```

## COMPONENT: gesture-detector

* Emit events for detected gestures
Add to a-scene tag: <a-scene gesture-detector>

* For making your own gesture-components catch events with:
sceneEl.addEventListener("onefingermove"..
sceneEl.addEventListener("twofingermove"..
sceneEl.addEventListener("threefingermove"..

## COMPONENT: gesture-rotation

* Add this gesture to an entity to be able to rotate it with a one-finger gesture

Inputs:
- rotationAxis: choose what axis the object is able to rotate about, valid inputs: x, y, xy

## COMPONENT: gesture-scale

* Add this gesture to an entity to be able to scale it with a two-finger gesture
