# User guide

Augmented Reality is a technology that fuses Virtual Reality with the real world to construct an enhanced experience. This web application is made to present its main functionalities and prove that this concept is a viable choice for Equinor both in terms of development complexity, cost and convenience. This application is divided into four parts, from now on referred to as Epic 1-4. For full functionality a mobile device is suggested.

// Add instructions on how to open/start the application.

## Epic 1

*epic1.html*

The purpose of Epic 1 is to show that the app can react to barcode markers (can be generated [here](https://au.gmented.com/app/marker/marker.php). More specifically they are 2D barcode markers of dimensions 3*3. Use "Generate a single marker image with code ___" with the codes specified below). The different possible scenarios are listed below, depending on the barcode the camera is pointing at. For click events, point with the circular cursor on the middle of the screen.

We printed the markers and put them on a guitar amplifier, but any box will do. For simple testing you can just point the camera at the markers without printing them and putting them on a box. Be aware that the markers do not work well on black/dark background. White background works fine. Choose to accept when the application asks to allow camera, geolocation and device motion sensors.

### Markers available in epic 1
The following markers enhances the real world. The number is the marker code.

* *0*: text will show over the marker as long as the app can see the marker
* *1*: a sound will play once when the app recognizes the marker. The sound will then play each time the marker is lost and then found again.
* *2*: a text will show as an overlay when the cursor (ring in the middle of the screen) "touches" the marker. Click the overlay to close it. (The overlay might sometimes show when it's not supposed to. This is probably due to the app falsely recognizes the marker.)
* *3*: a 3d model (penguin) will show over the marker as long as the marker is seen by the app. Rotate and scale the penguin using normal touch gestures.
* *4*: a 3d model (simple box) will show over the marker as long as the marker is seen by the app. Toggle the visibility of the box by clicking (by touch) on the box while aiming at it with the cursor.
* *5, 6, 7*: a line will be drawn between two markers when two markers are clicked. To click a marker, you will have to click it while the cursor is over the marker. The line is shown as long as the two markers are seen by the app. The line will reappear if the markers are lost and then found.

## Epic 2

*epic2.html*

The main purpose of Epic 2 is to show that large 3D models can be used in the app, both placed by relative position and gps locations, and how to interact with them. First of all it is important to ensure that the gps coordinates stated in the epic2.html script are located close to the user. The thought is that the eiffel_tower, mario_kart, banana, ho_oh and disco_ball objects have the same coordinates, and that the four sphere objects are located close to, but not on top of, each other. The reason why will be clear shortly. Remember to point with the circular cursor in the middle of the screen.

When pointing towards the Eiffel Tower, you will see:

* a rotating disco ball hanging from under the Eiffel Tower. When clicking on it a short music sample will start playing, and it will stop rotating. When clicking again it will start rotating again, and the same music will play.
* a stationary banana peel.
* Super Mario driving in his signature kart around the Eiffel Tower, and slipping when hitting the banana peel. When clicking on Mario's start position (just under the disco ball), his animation will pause/unpause.
* a Ho-Oh pokèmon (bird) hovering around the upper half of the Eiffel Tower.

When clicking on one of the spheres, it will start an animation. This animation is defined by stating the start and end location in the html script, in addition to the duration time (in milliseconds). It is possible to add other animation properties, see documentation. When clicking on two spheres consecutively a straight red line will be drawn between them. Hence, for convenience we suggest that the spheres are located relatively close to, but not on top of, one another.


## Epic 3

*epic3.html*
