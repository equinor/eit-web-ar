# User guide

Augmented Reality is a technology that fuses Virtual Reality with the real world to construct an enhanced experience. This web application is made to present its main functionalities and prove that this concept is a viable choice for Equinor both in terms of development complexity, cost and convenience. This application is divided into four parts, from now on referred to as Epic 1-4. For full functionality a mobile device is suggested.

## How to open the applications

**Prerequisites:**

- Android: Use Chrome browser
  - You might have to enable _webXR_ flags in _chrome://flags_ (enter as url in Chrome)
- iPhone: Use Safari
  - You might have to download the _webXR Viewer_ app

**Opening the web app:**

- Open [this link](https://eit-web-ar.app.playground.radix.equinor.com/) on your mobile phone (https://eit-web-ar.app.playground.radix.equinor.com/) 

## Epic 1: Can web AR enhance physical 3d printed models?

**URL: [Epic 1](https://eit-web-ar.app.playground.radix.equinor.com/epic1.html)**

The purpose of Epic 1 is to show that the app can react to barcode markers.  

To the bottom left of the screen there is an info button. When clicking on it, there will appear a simple guide to how to use the app.

- We printed the markers and put them on a guitar amplifier, but any box will do. 
- Choose to accept when the application asks to allow camera, geolocation and device motion sensors.
- For simple testing you can just point the camera at the markers without printing them and putting them on a box. 
- Be aware that the markers do not work well on black/dark background. White background works fine. 

### Markers for Epic 1
 **Markers: [Markers 0-10 for testing](markers0-10.png).**

The different possible scenarios are listed below, depending on the barcode the camera is pointing at.  
For click events, point with the circular cursor on the middle of the screen, then click on the cursor.

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


## Epic 2: Can web AR provide users with a sense of true scale of industrial equipment?
**URL: [Epic 2](https://eit-web-ar.app.playground.radix.equinor.com/epic2.html)**

The main purpose of Epic 2 is to show that large 3D models can be used in the app, both placed by relative position and gps locations, and how to interact with them. 

To the bottom left of the screen there is an info button. When clicking on it, there will appear a simple guide to how to use the app.

- When opening the app, the user has to either state the desired GPS coordinates for the objects, or use the current GPS location of the device. This is done by using the user interface, where you first click the GPS icon to the bottom right side of the screen. Then you either push the button "Use current position", or fill in the text boxes and then push the button "Submit GPS coordinates". 
- Remember to point with the circular cursor in the middle of the screen when interacting with the 3D objects. When looking around you will see:

| Target | Interaction |
| ------ | ----------- |
| A rotating disco ball | (Look up to see the disco ball). When clicking on it a short music sample will start playing, and it will stop rotating. When clicking again it will start rotating again, and the same music will play |
| Sphere | When clicking on one of the spheres, it will start an animation. When clicking on two spheres consecutively a straight red line will be drawn between them. The animation is defined by stating the start and end location in the html script, in addition to the duration time (in milliseconds). It is possible to add other animation properties, see documentation. |


## Epic 2.5

**URL: [Epic 2.5](https://eit-web-ar.app.playground.radix.equinor.com/epic2.5.html)**

Epic 2.5 is mainly an extension of Epic 2, introducing ways to manipulate GPS signals from the user device. This epic also shows how large 3D models can be experienced in an AR environment. When using the current GPS location of the device, the Eiffel Tower will appear right where you are so that you are standing under it. There will also be a lookout tower placed close to the Eiffel Tower. When walking to the lookout tower, the GPS signal will be manipulated so that the user is at the top of the lookout tower. This is done so that the user can look at the Eiffel Tower from a height, and to show that one can manipulate the location and altitude of the device. This way the user will experience that the models are more stable, eg. not moving around. When looking around you will see:

| Target | Interaction |
| ------ | ----------- |
| The Eiffel Tower | There is no interaction, but it shows how a large 3D object is experiences in AR. |
| Lookout tower | When walking to the tower and being within a radius of 3 meters, the user will be placed on the top of the tower. Now the user can look at the Eiffel Tower from above. |


## Epic 3: Can multiplayer be used in web AR?

**URL: [Epic 3](https://eit-web-ar.app.playground.radix.equinor.com/game.html)**
**Game Board**: [Game board](markers0-5.png)

The purpose of Epic 3 is to implement a proof of concept multiplayer app combined with AR. We implemented it as a multiplayer whack-a-mole game.

- Open up the game board on your laptop (or better, print it out).
- Sign in to the game by going to the URL on your phone.
- When signing into the game, the player can enter a username and choose which figure and color their entities will have (instead of the default green box). The entity settings will persist when sending the entities to other players.
- The game is started when two users have signed into the game. Each user will be assigned with three boxes (or other entities). The boxes are shown when pointing the camera on [the game board](markers0-5.png). 
- A user can send a box to another player by pointing the cursor at the box and clicking on it. When a user clicks on a box, the box will disappear from the user's markers and appear in front of another (randomly selected) player.
- One round of the game ends when one of the players does not have any boxes left. Another round starts after five seconds.

See the [video](./docs/Videos/game.mp4) to see how it should work while playing.
