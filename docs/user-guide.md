# User guide

(Document how the user can interact with the app)

_Examples:_  
Do _not_ press the red button!


## For Development

### COMPONENT: location-based.js
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