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
