# Epic 4

In Epic 4 we wanted to explore the possibilities of using web AR for creating some sort of virtual meeting. We wanted to make it possible to interact with other users in the meeting, as well as transmitting audio and possibly video.

One way of implement a virtual meeting might be to display avatars (or video streams) of the other users around you in a VR world at static positions.
However, to make the meeting more interactive, we settled on displaying the other participants as 3d models in the AR world.

The app is based on each user's gps positions. This means that when a users moves a little bit in reality, e.g. two meters to the right, this movement will be shown to the other users as if the user moved two meters in the virtual meeting. Rotation is also shown to the other users.

## Experiences made during Epic 4

The implementation of Epic 4 is based on everything we learned so far. The backend for Epic 4 is almost identical to the backend of Epic 3. The frontend consists of entities, animations and events through A-frame, WebSocket messages and requests to the API.

The tricky parts of this Epic was to manipulate the gps coordinates and combine them with the A-frame world coordinates. We collect GPS coordinates from AR.js (which relies on the Web Geolocation API) and send them to the server. Then the coordinates are manipulated so that each user will see the other users within a close proximity around them.

We also explored the possibility of transmitting audio between users with webRTC. We weren't able to finish the implementation of such functionality, but we certainly believe that it is possible to implement. As a substitude for webRTC audio strams, we implemented a way of sending audio messages to the other users. Instead of streaming audio, these are messages which are recorded, then sent, and them received and played.

All in all, it seems that creating a virtual AR/VR meeting based on A-frame and AR.js is very possible. Interactions with other participants, transmitting audio messages and "streaming" your position to others in the sense of models moving around in the AR world seems to work. A future version of the virtual meeting would probably contain the possibility to stream audio and video to other participants.

## Pros and cons with the approach
Pro: Enhances the meeting experience.
Con: Participants of a virtual meeeting will probably mostly be placed indoors. GPS signals are not really that great when indoors.

## Known bugs
- Throwing balls at each others stops working after sending an audio message
- Everything loads slow at first, meaning that entities will spawn at wrong positions.