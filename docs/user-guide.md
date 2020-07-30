# User guide

Augmented Reality is a technology that fuses Virtual Reality with the real world to construct an enhanced experience. This web application is made to present its main functionalities and prove that this concept is a viable choice for Equinor both in terms of development complexity, cost and convenience. This application is divided into four parts, from now on referred to as Epic 1-4. For full functionality a mobile device is suggested.

// Add instructions on how to open/start the application.

## Epic 1

_Can web AR enhance physical 3d printed models?_  
URL: app/epic1.html

The purpose of Epic 1 is to show that the app can react to barcode markers.  
We printed the markers and put them on a guitar amplifier, but any box will do. For simple testing you can just point the camera at the markers without printing them and putting them on a box. Be aware that the markers do not work well on black/dark background. White background works fine. Choose to accept when the application asks to allow camera, geolocation and device motion sensors.

### Markers available in epic 1
 
The different possible scenarios are listed below, depending on the barcode the camera is pointing at.  
For click events, point with the circular cursor on the middle of the screen.

[Markers 0-10 for testing](markers0-10.png).

| Code | Interaction |
| ---- | ------ |
| 0 | Text will show over the marker as long as the app can see the marker |
| 1 | A sound will play once when the app recognizes the marker. The sound will then play each time the marker is lost and then found again |
| 2 | A 3d model (penguin) will show over the marker as long as the marker is seen by the app. Rotate and scale the penguin using normal touch gestures |
| 3 | A 3d model (penguin) will show over the marker as long as the marker is seen by the app. Rotate and scale the penguin using normal touch gestures |
| 4 | A 3d model (simple box) will show over the marker as long as the marker is seen by the app. Toggle the visibility of the box by clicking (by touch) on the box while aiming at it with the cursor |
| 5, 6, 7 | A line will be drawn between two markers when two markers are clicked. To click a marker, you will have to click it while the cursor is over the marker. The line is shown as long as the two markers are seen by the app. The line will reappear if the markers are lost and then found. |

### How to create your own markers
1. Open [online tool](https://au.gmented.com/app/marker/marker.php)
1. Select 2D barcode markers of dimensions 3*3
1. Use "Generate a single marker image with code ___" with the codes specified in the table "Markers available in epic 1"


## Epic 2

_Can web AR provide users with a sense of true scale of industrial equipment?_  
URL: app/epic2.html

The main purpose of Epic 2 is to show that large 3D models can be used in the app, both placed by relative position and gps locations, and how to interact with them. First of all it is important to ensure that the gps coordinates stated in the epic2.html script are located close to the user. The thought is that the `disco_ball` and that the three `sphere` objects are located close to, but not on top of, each other. Remember to point with the circular cursor in the middle of the screen.

When pointing towards the Eiffel Tower, you will see:

| Target | Interaction |
| ------ | ----------- |
| A rotating disco ball hanging from under the Eiffel Tower | When clicking on it a short music sample will start playing, and it will stop rotating. When clicking again it will start rotating again, and the same music will play |
| A stationary banana peel | Super Mario driving in his signature kart around the Eiffel Tower, and slipping when hitting the banana peel. When clicking on Mario's start position (just under the disco ball), his animation will pause/unpause |
| Sphere | When clicking on one of the spheres, it will start an animation. This animation is defined by stating the start and end location in the html script, in addition to the duration time (in milliseconds). It is possible to add other animation properties, see documentation. When clicking on two spheres consecutively a straight red line will be drawn between them. Hence, for convenience we suggest that the spheres are located relatively close to, but not on top of, one another |


## Epic 2.5

*epic2.5.html*

Epic 2.5 is mainly an extension of Epic 2, introducing ways to manipulate GPS signals from the user device. A user interface feature is added, where the user can place the Eiffel Tower. The user can either press the button "Use currrent position" to place the Eiffel Tower exactly where the device is located, or the button "Submit GPS coordinates" after typing in the wanted GPS coordinates. When walking to the lookout tower, which is located close to the Eiffel Tower, the GPS signal will be manipulated so that the user is at the top of the lookout tower.


## Epic 3

URL: app/game.html

The purpose of Epic 3 is to implement a proof of concept multiplayer app combined with AR. We implemented it as a multiplayer whack-a-mole game.

When signing into the game, the player can enter a username. The player can also choose which figure and color their entities will have (instead of the default green box). The entity settings will persist when sending the entities to other players.


The game is started when two users have signed into the game. Each user will be assigned with three boxes (or other entities). The boxes are shown when pointing the camera on [markers 0-5](markers0-5.png). A user can send a box to another player by pointing the cursor at the box and clicking on it. When a user clicks on a box, the box will disappear from the user's markers and appear in front of another (randomly selected) player.

One round of the game ends when one of the players does not have any boxes left. Another round starts after five seconds.