const express = require('express');
const redis = require('redis');

const port = 3001;

const app = express();
app.use(express.json());

const db = redis.createClient({
  host: 'redis'
});

db.on('error', function(error) {
  console.log(error);
});

db.flushall();

app.get('/entities/:playerId', (req, res) => {
  // Check if user exists

  // Get the players entities from Redis

  // Respond with the results from Redis
  var entities = [1, 2, 0, 3, 0, 0];
  res.send({
    entities: entities
  });
  // Response (entities) + status code 200 (OK) if the user exists
  // Status code 404 (Not found) if the user doesn't exist
});

app.post('/register', (req, res) => {
  const name = req.body.name;

  // (Check if username already in use?)

  // Register player and respond with playerId
  db.incr('playerCount', function(err, playerId) {

    const hash = 'player:' + playerId;
    db.hmset(hash, 'name', name);

    // Push new entities into the player's entity list
    const numberOfEntities = 3;
    const numberOfMarkers = 6;

    db.incrby('entityCount', numberOfEntities, function(err, newEntityCount) {
      var entities = [];
      for (var entityId = newEntityCount - numberOfEntities + 1; entityId < newEntityCount + 1; entityId++) {
        entities.push(entityId);
      }

      // Todo: ensure numberOfMarkers is larger than numberOfEntities
      for (var i = entities.length; i < numberOfMarkers; i++) {
        entities.push(0);
      }
      entities = shuffle(entities);
      db.hmset(hash, 'entities', JSON.stringify(entities));
    });

    res.send({
      playerId: playerId
    });
  });

  // Response (playerId) + status code 201 (Created) if the user didn't exist before this request
  // (Status code 409 (Conflict) if the username is already in use?)
});

app.post('/sendEntity', (req, res) => {
  // Get parameters from request json
  const playerId = req.body.playerId;
  const entityId = req.body.entityId;

  // Check with Redis the information is correct

  // Update the entity list for this player
  // Add the entity to another player

  // testing
  res.send({
    playerId: playerId,
    entityId: entityId
  });
  // Status code 200 (OK) when the entity is added to another player
  // Status code 409 (Conflict) if the information in the request does not match the information in Redis
});

app.listen(port, () => {
  console.log('API listening on port ' + port);
});




function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}