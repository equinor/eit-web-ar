# Epic 3

In Epic 3 we wanted to see if we could create a multiplayer AR experience. To test this we created a game similar to [Whack-a-Mole](https://en.wikipedia.org/wiki/Whac-A-Mole). We created a game board by putting six barcode markers next to each other. When a player connects to the app, they register a name and a personal model. If you look at the game board with the mobile camera, you will see your personalized models appear. To "Whack" a model, you aim at it with the cursor and click on it. This personal model is then sent to another player (disappears from your game board and appears on the other players). While playing, players will keep sending models to each others game boards until somone runs out of models and wins.

The multiplayer interaction was enabled through the use of **Nodejs** and **expressjs** as backend and API, **redis** as storage, and **socketio** for real-time communication between frontend and backend.

## Experiences made during Epic 3
After epic 1 and epic 2 we had begun to get a good unsterstanding of A-frame and could start playing around with creating a frontend UI and backend with storage. We had no experience with expressjs, redis and socketio. So the main challenge was to learn these technologies, figure out the architecture, and get everything to work. 

In the backend, most of the effort went into setting up a backend API and a system that stored game data and sent out events to players when new data was available. In the frontend, the A-frame AR scene was easy to manipulate on multiplayer requests, and we created custom A-frame components through vanilla javascript. We experienced some problems with Cross-Origin-Resource-Sharing and spent some time configuring nginx and expressjs to solve this.

In the end, the multiplayer concept worked great and we could successfully send personalized models to other players. We have only tested the game with up to four players and we do not know how the app will react with 10+ players.

The way A-frame displays the models on the game board is not perfect and sometimes AR.js has trouble recognizing the markers so the models are not displayed.

## Pros and Cons with the approach
Pro: This setup was fairly easy to setup and get going. Redis is great for quickly setting up a simple storage system. The A-frame scene is easily modifiable through javascript and socketio events.

Cons: Resetting the redis server will lose the data. This setup is thus only good for applications that does not need persistent data.

## More detailed notes

### Clicking on models
In our app you can only click on models if you aim the cursor at the object and click on the cursor. We wanted to be able to click on a model without a cursor (being able to click a model anywhere on the smartphone screen using touch), but were not able to figure it out.

A-frame uses ray casting to register click events. A ray is sent from the cursor, straight forward, and if it connects to an object a click is registered. We think that the ray needs some sort of entity source (like the cursor entity), and that is why it is hard to implement clicking from different parts of the smartphone screen.
