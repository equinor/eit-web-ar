# Epic 2

## Experience made during epic 2
When loading the gltf models in the application, several of the objects in AR appear as black and white (no colours). This is commonly caused by using .gltf files instead of .glb, but they appear as colourless either way for us. After spending hours trying to fix this, we concluded that it was not worth correcting it considering the time provided.

Using Blender for creating animations on gltf models had a lot of advantages. It is possible to make complex animations on large and detailed objects, making it valuable for comprehensive projects/applications. We only had the time to learn the basic tools and features of the program, but were able to make acceptable products. 

## Pros and cons with the approach
The big downside with using the phone gps to anything at all is that the gps signal is not stable. In our case that means that when we place an object (e.g. eiffel tower) at a gps location, the object will drift around in a proximity to the gps location it was supposed to be stationary at. See [this video](https://drive.google.com/file/d/1d7EgDE9wp43lk-vgqNgFjKLFp0RlSh6N/view?usp=sharing) for an example.

We found it hard to get the "true scale feeling" when placing large models in the AR world. One of the problems is that the objects are always placed in front of what is seen by the camera. It might be possible to solve this using height data and calculate whether the 3d model is in front of or behind the landscape and buildings. Placing the 3d model at a big open place with buildings at the sides could have made it feel more true scale.

An upside is that all users of the app can see the same object at the same location. This opens up for another kind of interaction between users than if models are only placed relative to the users position. One possible way for users to interact is to send models to other users' locations. Gps located models also opens up for multiple users to "visit" the same object at the same location.

## More detailed notes

### Animation

#### Embedded animation in gltf models
To add animations and edit models we used the Blender program, which can easily be downloaded from https://blender.org. When the models were finished they were exported and converted to .glb files, and implemented in the project code. A model can be loaded like an asset like this:

```html
<a-asset-item
    id="disco_ball"
    src="./gltf/disco_ball/scene.glb"
    preload="auto">
</a-asset-item>
```

To add the animation property of the gltf model to the application, a-frame-extras needs to be installed. This can be done by running the terminal command `npm install --save aframe-extras`. We need these add-ons to access the `animation-mixer` component, which loades the embedded gltf model animations. Then the entity can be implemented like this:

```html
<a-entity
    id="disco_ball_ent"
    animation-mixer
    gps-object='object: #disco_ball; location: { "lat": 68.679019, "lng": 16.796625 }; scale: 0.0495'>
</a-entity>
```

By default the animation is looped. This, and other properties, can be specified in the implementation, eg. `animation-mixer="loop='once'; duration=3"`. To be able to pause and unpause this embedded animation we have made an `animation-pauser` component. When this is used the animation will pause when clicking on it, and unpause when clicking again. The implementation can look like this:

```html
<a-entity
    id="disco_ball_ent"
    animation-mixer
    animation-pauser
    gps-object='object: #disco_ball; location: { "lat": 68.679019, "lng": 16.796625 }; scale: 0.0495'>
</a-entity>
```

### Gps object sound effects
To add sound effects on gps placed objects we have made a component called `gps-sound`. When clicking on an object a sound will start to play. The implementation can look like this:

```html
<a-entity
    id="disco_ball_ent"
    gps-object='object: #disco_ball; location: { "lat": 68.679019, "lng": 16.796625 }; scale: 0.0495'
    gps-sound 
    sound="src: #music" 
    autoplay="false">
</a-entity>
```

Here we are assuming that the sound is loaded as an asset like this: 

```html
<a-asset>
    <audio id="music" src="./audio/music.mp3" preload="auto"></audio>
</a-asset>
```