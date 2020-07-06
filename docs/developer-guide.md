# Developer guide

## COMPONENT: gps-object
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


## COMPONENT: draw-line-click

The draw-line-click component is supposed to be added to entities or markers like this:

```html
<a-marker draw-line-click type='barcode' value='5' id='5'></a-marker>
```

You will need at least two entities with the draw-line-click component to be able to draw a line.

To draw a line between two entities, you do the following:
* point the cursor at one entity and click it
* point the cursor at the other entity and click it

The line will now be shown as long as both entities are shown. The position will be updated continously to match the position of the entities.

### Attributes:
* color: Default is '#f00'.


## COMPONENT: draw-line

Supposed to automatically draw lines from markers with the draw-line component to all other visible markers.

```html
<a-marker draw-line type='barcode' value='5' id='5'></a-marker>
```

## COMPONENT: gps-intersection

The `gps-intersection` component is added to an entity along with the `gps-entity-place` component. An event is fired each time the camera is within a given radius from the position of the `gps-entity-place` component.

### Attributes:

* radius: How far from the specified gps location the event should fire. In meters. Default is 1.
* onlyInOut: Whether the event should only fire when the user enters and exits the radius of interest (true), or whether the event should keep firing at each tick while the user is inside the radius of interest (false). Default is true.

### Example of implementation:

```html
<a-entity
   gps-entity-place="latitude: 59.959941; longitude: 10.701367"
   gps-intersection='radius: 40'
></a-entity>
```

The code above will make the `gps-intersection` event fire when the camera is within a radius of 40 meters to the point `59.959941, 10.701367`.

### The `gps-intersection` event emitted

The components emits an event of the type `gps-intersection` when the user enters and exits the radius of interest (and possibly also emits the event while the user is inside the radius of interest, depending on the `onlyInOut` attribute).

The `gps-intersection` event is emitted from the entity which has the `gps-intersection` component.

The event is emitted along with the following data:
* distance: meters from the gps-location specified in the entity.
* direction: 'in' (user is on the way into the radius of interest) 'out' (user is on the way out of the radius of interest) or 'stay' (user keeps inside the radius of interest)


## COMPONENT: marker-sound

The component is added to a marker. When the marker is found, the specified audio file will play. The audio will then play each time the marker is lost and then found again.

### Attributes
* src: reference to the asset with the audio source

### Example of implemention

```html
<a-asset>
  <audio id="audioMarkerFound" src="./audio/markerFound.mp3" preload="auto"></audio>
</a-asset>

<a-marker marker-sound sound="src: #audioMarkerFound" autoplay="false" type='barcode' value='1'>
</a-marker>
```


## COMPONENT: show-modal
When this component is added to a marker, a modal with specified content will show on the entire screen when the specified trigger event happens. The modal can be closed by clicking on it.

### Attributes
* modalId: reference to the html element with the modal contents
* trigger: the event that should trigger the modal popup. Default to 'markerFound'. Alternatives might be e.g. 'click' or 'mouseenter'.

### Example of implementation

```html
<a-asset>
  <div id="longText">
    <p>Vox is a musical equipment manufacturer founded in 1957 by Thomas Walter Jennings in Dartford, Kent, England. </p>
    <p>The company is most famous for making the Vox AC30 guitar amplifier, used by The Beatles, The Rolling Stones, The Kinks, The Yardbirds,</p>
    <p> Queen, Dire Straits, U2 and Radiohead, the Vox Continental electric organ, the Vox wah-wah pedal used by Jimi Hendrix, and a series of innovative bass guitars.</p>
    <p> ( Touch to close this window )</p>
  </div>
</a-asset>

<a-marker show-modal="modalId: longText; trigger: mouseenter" type='barcode' value='2'>
</a-marker>
```

## COMPONENT: cursor-interactive
Adds the `cursor-interactive` class to itself (`this.el`) and all child ~~entities~~ elements. The classes are added after the scene is rendered. The class is therefore also added to elements that other components add to the scene in their `init`.

### Attributes

* addToChildren: Whether the component should add the `cursor-interactive` class to child elements. Default is true.

### Example of implementation

As a property on an entity:

```html
<a-marker
  draw-line-click
  cursor-interactive
  type='barcode'
  value='5'
  id='5'>
</a-marker>
```

As a dependency in a component:

```javascript
AFRAME.registerComponent('show-modal', {
  dependencies: [
    'cursor-interactive'
  ],
  schema: {
  },
  ...
```


## COMPONENT: standstill-gps-camera
### What:
**Two things:**
1) Calculates the device's average gps position based on 20 datapoints (can be adjusted in the get-avg-gps-location component) and uses this to set the cameras position in the scene. The position is set at every added datapoint, until the average position is not changing anymore.

2) Removes the rotation feature which updates where our device is pointing. I THINK that using this feature makes the camera recognize which way we are rotating our camera in relation to the compass north direction. However, using this feature also makes the object vibrate/jump around a bit (which is why we remove it).

Note: The majority of this component is copied from gps-camera.

### Why:
This provides a camera position that does not jump around. Giving you a more stable AR experience when looking at a gps generated object.

### Caveats:
This is for standing still. Not much will happen if you try to move around (physically).

### How to use:
* REPLACE **gps-camera** with **standstill-gps-camera** in the <a-camera> entity:
    e.g: <a-camera standstill-gps-camera rotation-reader position="0 0 0">
* **standstill-gps-camera** depends on the **get-avg-gps-location** component. But it is generated automatically. So just add **standstill-gps-camera**.


## COMPONENT kalman-gps-camera

### STATUS:
* Needs testing and tuning!
* The model is based on the velocity from measurements, so the model should be improved if possible. Any ideas?

### What:
Uses a kalman filter to approximate your position in the scene.
* Measurement comes from gps position, where lat/lng is converted to coordinates in the scene before getting put through the filter.
* Model comes from using the velocity from the gps together with compass direction, to model what direction and how far the device has moved since the last measurement.

### Why:
Hopefully this will provide a more stable experience while using location-based AR while walking.

### How to use:
* REPLACE **gps-camera** with **kalman-gps-camera** in the <a-camera> entity:
    e.g: <a-camera kalman-gps-camera="R: 1; Q: 2; logConsole: true" rotation-reader position="0 0 0">
* Tune the kalman filter with R and Q.
  * R: the process noise of our system (how accurate is our model? use lower R for more accurate)
  * Q: measurement noise (how accurate is the measurement? use lower Q for more accurate)
    * The important part is the **ratio** between R and Q. The ratio determines how much the kalman filter trusts the measure/model.
  * B: Scaling factor for the input (B*u)
      * u.x = dt*Math.sin(this.heading)*v; <!-- u.x is the modelled change in x position -->
      * u.z = dt*Math.cos(this.heading)*(-v); <!-- u.z is the modelled change in z position -->
        * dt: time between gps readings
        * this.heading: compass direction, read as clockwise degrees from north
        * v: speed from gps
* How kalman.js works: https://github.com/wouterbulten/kalmanjs

### Dependencies:
* Needs the kalman.js module, located in /src/modules/kalman.js




## Animate (gps placed) object

### Example

```html
<a-asset-item
    id="magnemite"
    src="./gltf/magnemite/scene.gltf"
    preload="auto">
</a-asset-item>

<a-entity
id="magnemite"
gps-entity-place='latitude: 59.959941; longitude: 10.701367'
gltf-model='#magnemite'
scale='0.5 0.5 0.5'
animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
cursor-interactive
></a-entity>
```

## COMPONENT: gps-animation

The `gps-animation` component makes it possible to animate the position of a gps placed entity (entity with the `gps-entity-place` component).
The animation is initiated with the `animation` component. Use the usual attributes on `animation`.

`gps-animation` has one property directly on the `el.data` object.
This property expects a string with latitude and longitude seperated by space, e.g. `59.959825 10.701532`.
Each time the `data` object in the `gps-animation` component is updated, the position of the `gps-entity-place` is also updated.

The gps position animation happens by using `animation` to update the `data` object in `gps-animation`, and then the `gps-animation` component pushes the update to `gps-entity-place`.

You will need to set `gps-animation` as the animation property, as well as the coordinated the object is supposed to move between. As mentioned, the coordinates are on the form `latitude longitude`, seperated with space.

### Example of implementation

```html
 <a-entity
   gps-entity-place='latitude: 59.959941; longitude: 10.701367'
   gps-animation
   animation="property: gps-animation; from: 59.959941 10.701367; to: 59.959825 10.701532; loop: false; dur: 30000; startEvents: click;"
   gltf-model='#magnemite'
   cursor-interactive
 ></a-entity>
```

The gps position animation can be combined with other animations by separating two `animation` instances with double underscore:

```html
animation__gps="property: gps-animation; from: 59.959941 10.701367; to: 59.959725 10.701832; loop: false; dur: 10000; startEvents: click;"
animation__rotation="property: rotation; from: 0 0 0; to: 0 360 0; loop: false; dur: 10000; startEvents: click;"
```

Adding the attributes above to an entity will make it move and rotate at the same time.

## COMPONENT: gps-polygon-intersection

This components emits the `gps-polygon-intersection` event when the user steps inside a polygon (area consisting of gps points), and when the user exits the polygon. If the `keepEmitting` property is set to `true` then the emit will keep emitting while the user is inside the polygon.

### Attributes

* polygon: array of the points that the polygon consists of. The format of this property is shown in the example below.
* keepEmitting: If true, the `gps-polygon-intersection` event will be emitted as long as the user stays inside the polygon. Default is false.

### Example of implementation

The entity below will emit the `gps-polygin-intersection` event when the user moves outside->inside and inside->outside the polygon consisting of the four points given as the `polygon` property.

```html
<a-entity
  gps-polygon-intersection='polygon: [
    { "lat": 59.959364, "lng": 10.700504 },
    { "lat": 59.960256, "lng": 10.700182 },
    { "lat": 59.960363, "lng": 10.703025 },
    { "lat": 59.959353, "lng": 10.703025 }
  ]'
  >
</a-entity>
```

### The `gps-polygon-intersection` event

This is the event emitted by the component.
It is possible to listen to the event on the entity or on the scene.

```javascript
this.el.addEventListener('gps-polygon-intersection', function(e) {
  console.log(e);
})
```