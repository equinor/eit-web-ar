const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/entities/:playerId', (req, res) => {
  // Check if user exists

  // Get the players entities from Redis

  // Respond with the results from Redis
  var entities = [1, 2, 0, 3, 0, 0];
  res.send({
    entities: entities
  });
  // Response + status code 200 (OK) if the user exists
  // Status code 404 (Not found) if the user doesn't exist
});

app.post('/register', (req, res) => {
  const playerId = req.body.playerId;

  // Check if user exists

  // If user does not exist, register the user in Redis

  // Status code 201 (Created) if the user didn't exist before this request
  // Status code 409 (Conflict) if the user already exists
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