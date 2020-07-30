# A-frame components

## gps-object

Add the gps-object tag to an entity, together with its properties. For example:

```html
<a-entity
  gps-object='object: #magnemite; location: { "lat": 54.959941, "lng": 12.701367 }; scale: 0.1; printDistance: true'
>
</a-entity>
```

- object: reference to the asset containing the model you want to show.
- location: enter lat and lng coordinates on the format '{ "lat": latitude, "lng": longitude }'.
- scale: scaling of the model. Default is 1.
- printDistance: Whether the component should keep printing the distance from the camera to the object. 'true' or 'false'. Default is 'false'.

Make sure to add your model as an asset:

```html
<a-assets>
  <a-asset-item id="magnemite" src="./gltf/magnemite/scene.gltf" preload="auto">
  </a-asset-item>
</a-assets>
```

## get-avg-gps-location

- Put get-avg-gps-location in the camera tag, like this:

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

- Available options (with default values):

```html
<a-camera
  ...
  get-avg-gps-location="gpsPointsCount: 15; logConsole: true"
></a-camera>
```

- Get current average position:

```html
<script>
  document
    .querySelector("[get-avg-gps-location]")
    .getAttribute("get-avg-gps-location").positionAverage;
</script>
```

## gesture-detector

- Emit events for detected gestures
  Add to a-scene tag: <a-scene gesture-detector>

- For making your own gesture-components catch events with:
  sceneEl.addEventListener("onefingermove"..
  sceneEl.addEventListener("twofingermove"..
  sceneEl.addEventListener("threefingermove"..

## gesture-rotation

- Add this gesture to an entity to be able to rotate it with a one-finger gesture

Inputs:

- rotationAxis: choose what axis the object is able to rotate about, valid inputs: x, y, xy

## gesture-scale

- Add this gesture to an entity to be able to scale it with a two-finger gesture

## draw-line-click

You will need at least two entities with the draw-line-click component to be able to draw a line.

To draw a line between two entities, you do the following:

- point the cursor at one entity and click it
- point the cursor at the other entity and click it

The line will now be shown as long as both entities are shown. The position will be updated continously to match the position of the entities.

### Attributes:

- offset: Offset in starting point of the line, relative to the entity that initiated the line. Default: 0,0,0.
- color: Default is '#f00'.

### Example of implementation

The draw-line-click component is supposed to be added to entities or markers like this:

```html
<a-marker draw-line-click type="barcode" value="5" id="5"> </a-marker>
```

With offset, color and linewidth:

```html
<a-marker
  draw-line-click="offset:10 3 -3; color: #0f0; linewidth: 3"
  type="barcode"
  value="5"
  id="5"
>
</a-marker>
```

## draw-line

Supposed to automatically draw lines from markers with the draw-line component to all other visible markers.

```html
<a-marker draw-line type="barcode" value="5" id="5"></a-marker>
```

## gps-intersection

The `gps-intersection` component is added to an entity along with the `gps-entity-place` component. An event is fired each time the camera is within a given radius from the position of the `gps-entity-place` component.

### Attributes:

- radius: How far from the specified gps location the event should fire. In meters. Default is 1.
- onlyInOut: Whether the event should only fire when the user enters and exits the radius of interest (true), or whether the event should keep firing at each tick while the user is inside the radius of interest (false). Default is true.

### Example of implementation:

```html
<a-entity
  gps-entity-place="latitude: 59.959941; longitude: 10.701367"
  gps-intersection="radius: 40"
></a-entity>
```

The code above will make the `gps-intersection` event fire when the camera is within a radius of 40 meters to the point `59.959941, 10.701367`.

### The `gps-intersection` event emitted

The components emits an event of the type `gps-intersection` when the user enters and exits the radius of interest (and possibly also emits the event while the user is inside the radius of interest, depending on the `onlyInOut` attribute).

The `gps-intersection` event is emitted from the entity which has the `gps-intersection` component.

The event is emitted along with the following data:

- distance: meters from the gps-location specified in the entity.
- direction: 'in' (user is on the way into the radius of interest) 'out' (user is on the way out of the radius of interest) or 'stay' (user keeps inside the radius of interest)

## marker-sound

The component is added to a marker. When the marker is found, the specified audio file will play. The audio will then play each time the marker is lost and then found again.

### Attributes

- src: reference to the asset with the audio source

### Example of implemention

```html
<a-asset>
  <audio
    id="audioMarkerFound"
    src="./audio/markerFound.mp3"
    preload="auto"
  ></audio>
</a-asset>

<a-marker
  marker-sound
  sound="src: #audioMarkerFound"
  autoplay="false"
  type="barcode"
  value="1"
>
</a-marker>
```

## show-modal

When this component is added to a marker, a modal with specified content will show on the entire screen when the specified trigger event happens. The modal can be closed by clicking on it.

### Attributes

- modalId: reference to the html element with the modal contents
- trigger: the event that should trigger the modal popup. Default to 'markerFound'. Alternatives might be e.g. 'click' or 'mouseenter'.

### Example of implementation

```html
<a-asset>
  <div id="longText">
    <p>
      Vox is a musical equipment manufacturer founded in 1957 by Thomas Walter
      Jennings in Dartford, Kent, England.
    </p>
    <p>
      The company is most famous for making the Vox AC30 guitar amplifier, used
      by The Beatles, The Rolling Stones, The Kinks, The Yardbirds,
    </p>
    <p>
      Queen, Dire Straits, U2 and Radiohead, the Vox Continental electric organ,
      the Vox wah-wah pedal used by Jimi Hendrix, and a series of innovative
      bass guitars.
    </p>
    <p>( Touch to close this window )</p>
  </div>
</a-asset>

<a-marker
  show-modal="modalId: longText; trigger: mouseenter"
  type="barcode"
  value="2"
>
</a-marker>
```

## cursor-interactive

Adds the `cursor-interactive` class to itself (`this.el`) and all child ~~entities~~ elements. The classes are added after the scene is rendered. The class is therefore also added to elements that other components add to the scene in their `init`.

### Attributes

- addToChildren: Whether the component should add the `cursor-interactive` class to child elements. Default is true.

### Example of implementation

As a property on an entity:

```html
<a-marker draw-line-click cursor-interactive type="barcode" value="5" id="5">
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

## standstill-gps-camera

### What:

**Two things:**

1. Calculates the device's average gps position based on 20 datapoints (can be adjusted in the get-avg-gps-location component) and uses this to set the cameras position in the scene. The position is set at every added datapoint, until the average position is not changing anymore.

2. Removes the rotation feature which updates where our device is pointing. I THINK that using this feature makes the camera recognize which way we are rotating our camera in relation to the compass north direction. However, using this feature also makes the object vibrate/jump around a bit (which is why we remove it).

Note: The majority of this component is copied from gps-camera.

### Why:

This provides a camera position that does not jump around. Giving you a more stable AR experience when looking at a gps generated object.

### Caveats:

This is for standing still. Not much will happen if you try to move around (physically).

### How to use:

- REPLACE **gps-camera** with **standstill-gps-camera** in the <a-camera> entity:
  e.g: <a-camera standstill-gps-camera rotation-reader position="0 0 0">
- **standstill-gps-camera** depends on the **get-avg-gps-location** component. But it is generated automatically. So just add **standstill-gps-camera**.

## kalman-gps-camera

### STATUS:

- Needs testing and tuning!
- The model is based on the velocity from measurements, so the model should be improved if possible. Any ideas?

### What:

Uses a kalman filter to approximate your position in the scene.

- Measurement comes from gps position, where lat/lng is converted to coordinates in the scene before getting put through the filter.
- Model comes from using the velocity from the gps together with compass direction, to model what direction and how far the device has moved since the last measurement.

### Why:

Hopefully this will provide a more stable experience while using location-based AR while walking.

### How to use:

- REPLACE **gps-camera** with **kalman-gps-camera** in the <a-camera> entity:
  e.g: <a-camera kalman-gps-camera="R: 1; Q: 2; logConsole: true" rotation-reader position="0 0 0">
- Tune the kalman filter with R and Q.
  - R: the process noise of our system (how accurate is our model? use lower R for more accurate)
  - Q: measurement noise (how accurate is the measurement? use lower Q for more accurate)
    - The important part is the **ratio** between R and Q. The ratio determines how much the kalman filter trusts the measure/model.
  - B: Scaling factor for the input (B\*u)
    - u.x = dt*Math.sin(this.heading)*v; <!-- u.x is the modelled change in x position -->
    - u.z = dt*Math.cos(this.heading)*(-v); <!-- u.z is the modelled change in z position -->
      - dt: time between gps readings
      - this.heading: compass direction, read as clockwise degrees from north
      - v: speed from gps
- How kalman.js works: https://github.com/wouterbulten/kalmanjs

### Dependencies:

- Needs the kalman.js module, located in /src/modules/kalman.js

## gps-animation

The documentation for this component is correct until [commit e66511](https://github.com/equinor/eit-web-ar/commit/e66511d5525f1362186c8b8ebf558a9abf3ca1ee).

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
  gps-entity-place="latitude: 59.959941; longitude: 10.701367"
  gps-animation
  animation="property: gps-animation; from: 59.959941 10.701367; to: 59.959825 10.701532; loop: false; dur: 30000; startEvents: click;"
  gltf-model="#magnemite"
  cursor-interactive
></a-entity>
```

The gps position animation can be combined with other animations by separating two `animation` instances with double underscore:

```html
animation__gps="property: gps-animation; from: 59.959941 10.701367; to:
59.959725 10.701832; loop: false; dur: 10000; startEvents: click;"
animation__rotation="property: rotation; from: 0 0 0; to: 0 360 0; loop: false;
dur: 10000; startEvents: click;"
```

Adding the attributes above to an entity will make it move and rotate at the same time.

## animation-pauser

The `animation-pauser` component makes it possible to pause and unpause a built-in animation in a gltf-model. This presupposes that the `animation-mixer` component is used to construct the animation in the html entity. It also presupposes that the `cursor-interactive` component is present in the html entity. To pause/unpause the animation you need to point the cursor at the gltf-model and perform a simple click (either touch screen or mouse).

### Example of implementation

```html
<a-entity
  id="circus_acrobat_ent"
  animation-mixer
  animation-pauser
  gps-object='object: #circus_acrobat; location: { "lat": 68.679019, "lng": 16.796625 }; scale: 1'
  cursor-interactive
></a-entity>
```

In this example the gltf-model is placed at the gps location (68.679019, 16.796625), which can easily be changed by inserting the desired location. The gltf-model is loaded earlier in the html script as an asset-item like this:

```html
<a-asset-item
  id="circus_acrobat"
  src="./gltf/circus_acrobat/scene.gltf"
  preload="auto"
></a-asset-item>
```

## gps-sound

The `gps-sound` component makes it possible to play mp3-sounds when clicking on gltf-models placed with gps coordinates.

### Example of implementation

```html
<a-entity
  id="disco_ball_ent"
  animation-mixer
  animation-pauser
  gps-object='object: #disco_ball; location: { "lat": 68.679019, "lng": 16.796625 }; scale: 0.0495'
  gps-sound
  sound="src: #music"
  autoplay="false"
>
</a-entity>
```

In this example the gltf-model is placed at the gps location (68.679019, 16.796625), which can easily be changed by inserting the desired location. The gltf-model and sound are loaded earlier in the html script as asset/asset-items like this:

```html
<a-asset-item
  id="circus_acrobat"
  src="./gltf/circus_acrobat/scene.gltf"
  preload="auto"
></a-asset-item>
<a-asset>
  <audio id="music" src="./audio/music.mp3" preload="auto"></audio>
</a-asset>
```

## gps-polygon-intersection

This components emits the `gps-polygon-intersection` event when the user steps inside a polygon (area consisting of gps points), and when the user exits the polygon. If the `keepEmitting` property is set to `true` then the emit will keep emitting while the user is inside the polygon.

### Attributes

- polygon: array of the points that the polygon consists of. The format of this property is shown in the example below.
- keepEmitting: If true, the `gps-polygon-intersection` event will be emitted as long as the user stays inside the polygon. Default is false.

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
this.el.addEventListener("gps-polygon-intersection", function (e) {
  console.log(e);
});
```

## handpose

This component detects between two hand-poses, flat hand and closed hand (fistbump hand). It also emits the 3D world position of the handpalm (base of hand).
This component must be attached to the camera entity as "handpose"

### Attributes

- loop_timer: the time interval in milliseconds between each prediction.
- emit_3d_pos: toggle on/off calculating and emitting 3d world position of handpalm.

### Example of implementation

```HTML
<a-entity camera>
   <a-entity
      cursor="fuse: false;"
      handpose
   ></a-entity>
</a-entity>
```

### The 'handpose' event

object with 2 members, handpose and position

```javascript
{
   handpose: handpose_gesture,
   position: hand_world_position,
}
```

Listen to event in javascript

```javascript
this.el.sceneEl.addEventListener("handpose", function (e) {
  console.log(e.detail.position);
  console.log(e.detail.handpose);
});
```

## fixed-point-kalman-gps-camera

A component based on the component `kalman-gps-camera` presented earlier (further developed). The `fixed-point-kalman-gps-camera` component has the same attributes and functionalities as `kalman-gps-camera`, but some new ones. The purpose of the component is to place gps points that will attach the app user to it if the user is within a given radius of the point. This is done by manipulating the gps position of the user, thus not using the measured gps position. These points are relative to an input GPS coordinate, and the radius is given by the attribute `radius`. To alter/add/remove such relative points one has to implement it in the `fixed-point-kalman-gps-camera.js` component script.
### Attributes

- Q: float (non-negative). Measurement noise (how accurate is the measurement? use lower Q for more accurate)
- R: float (non-negative). The process noise of our system (how accurate is our model? use lower R for more accurate)
  - The important part is the **ratio** between R and Q. The ratio determines how much the kalman filter trusts the measure/model
- B: float (non-negative). Scaling factor for the input (B\*u)
- logConsole: bool.
- radius: float (non-negatve). Radius (in meters) around a GPS point, where the user GPS position is to be manipulated to the GPS point

### Example of implementation

´´´HTML
<a-camera fixed-point-kalman-gps-camera="R: 1; Q: 0.12; logConsole: true; radius: 2" rotation-reader look-controls position="0 0 0"></a-camera>
´´´