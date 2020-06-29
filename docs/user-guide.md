# User guide

## Epic 1

*epic1.html*

The app reacts on barcode markers (can be generated [here](https://au.gmented.com/app/marker/marker.php). 2D barcode markers, dimensions 3*3. Use "Generate a single marker image with code ___" with the codes specified below).

We printed the markers and put them on a guitar amplifier, but any box will do. For simple testing you can just point the camera at the markers without printing them and putting them on a box.

Be aware that the markers do not work well on black/dark background. White background works fine.

* *Marker 0*: text will show over the marker as long as the app can see the marker
* *Marker 1*: a sound will play once when the app recognizes the marker. The sound will then play each time the marker is lost and then found again.
* *Marker 2*: a text will show as an overlay when the cursor (ring in the middle of the screen) "touches" the marker. Click the overlay to close it. (The overlay might sometimes show when it's not supposed to. This is probably due to the app falsely recognizes the marker.)
* *Marker 3*: a 3d model (penguin) will show over the marker as long as the marker is seen by the app. Rotate and scale the penguin using normal touch gestures.
* *Marker 4*: a 3d model (simple box) will show over the marker as long as the marker is seen by the app. Toggle the visibility of the box by clicking (by touch) on the box while aiming at it with the cursor.
* *Marker 5, 6, 7*: a line will be drawn between two markers when two markers are clicked. To click a marker, you will have to click it while the cursor is over the marker. The line is shown as long as the two markers are seen by the app. The line will reappear if the markers are lost and then found.

## Epic 2

*epic2.html*


## Epic 3

<<<<<<< HEAD
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

=======
*epic3.html*
>>>>>>> master
