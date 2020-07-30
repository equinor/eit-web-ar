## Conclusion

Web AR shows great promise for driving lightweight and accessible AR experiences using a smartphone. It is both more convenient and cheaper than hardware-based AR experiences (like HoloLens). 

A-frame and AR.js is simple to use and provide tools for creating both simple and complex web AR experiences. Combined with backend, storage, and technologies like webRTC, you can really do a lot of interesting things.

However, at the current state of web AR, there are some compatibility and performance concerns. The compatibility is easy to fix by just getting a compatible smartphone and browser. But the performance concern is due to limitations in network and hardware. Therefore, experiences that require a lot of computing might not work optimally in web AR.

Web AR is in rapid development and we can probably see better performance in the relatively near future (for example through WebAssembly). We can also expect most browsers to soon provide webXR compatability by default.

### Summarizing tables

**Epics**

| **Epic** | **Evaluation** | **Notes** |
| --- | --- | --- |
| 1 - Can web AR enhance physical 3d printed models? | Yes | Possible to display stable models and text on barcode markers. As well as play sounds on POI. |
| 2 - Can web AR provide users with a sense of true scale of industrial equipment? | To some extent | It is hard to get a true sense of scale due to the inaccuracy in gps and the limitations in comparing the model to real life objects. But the experience is not horrible, andthe interaction between objects and POI works well. |
| 3 - Can multiplayer AR work with web technologies? | Yes | It works well. Pretty much anything in the a-frame scene is modifiable through a multiplayer experience. Easily replicable to presentations, for example. |
| 4 - Can web AR be used for creating multiuser virtual meetings? | Yes | Works well. |

**Features**

| **Feature** | **Evaluation** | **How** |
| --- | --- | --- |
| Enhance physical objects with text and models | Yes | Markers, events |
| Play sound at point of interest | Yes | Markers, GPS, events |
| Show true scale | To some extent | GPS |
| Multiplayer | Yes | Backend, database |

**Methods (A-frame, ARjs)**

| **Method** | **Evaluation** | **Notes** |
| --- | --- | --- |
| Image tracking | Lagging |
| QR code tracking | Not recognizing well |
| Barcode tracking | Adequately | Best performance of the markers. |
| Location-based AR (GPS) | Ok | The objects jump around a bit because of the GPS inaccuracies. This was improved with two methods: Kalman filter and viewpoint spots. |

**Compatibilities**

| **What** | **Model/Type** | **Notes** |
| --- | --- | --- |
| Smartphone | Android | Need to check if the smartphone has ARCore. Works with Chrome browser. |
 | iPhone | Need to check if the smartphone has ARKit. Works with Safari. |
| Browser | Chrome | Need to enable webXR flags in chrome://flags. |
 | Safari | Works well. |