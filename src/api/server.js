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

db.set('playerCount', '0');


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
  const playerId = db.get('playerCount');
  db.incr('playerCount');

  const hash = 'player:' + playerId;
  db.hmset(hash, 'name', name);

  res.send({
    playerId: playerId
  });

  const hei = db.hmget(hash, 'name');
  console.log(hei);
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