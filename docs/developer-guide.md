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
