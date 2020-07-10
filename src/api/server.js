var utils = require("./utils");

const express = require('express');
const cors = require('cors')
const redis = require('redis');

const port = 3001;

const app = express();
app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log('API listening on port ' + port);
});

const db = redis.createClient({
  host: 'redis'
});
db.on('error', function(error) {
  console.log(error);
});
db.flushall();

app.options('*', cors()) // pre-flight cors

app.get('/player/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  hash = utils.getPlayerHash(playerId);
  db.hgetall(hash, function(err, playerInfo) {
    var statusCode = 404;
    if (playerInfo === null) {
      res.status(statusCode).send();
      return;
    }
    statusCode = 200;
    var response = playerInfo;
    response.entities = JSON.parse(response.entities);
    res.status(statusCode).send(response);
  });
});

app.put('/player/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const keys = Object.keys(req.body);
  var args = [];
  keys.forEach(key => {
    args.push(key);
    args.push(req.body[key]);
  })
  const hash = utils.getPlayerHash(playerId);
  db.hmset(hash, args);

  res.status(200).send();
});

app.post('/player/add', (req, res) => {
  const name = req.body.name;
  db.incr('playerCount', function(err, playerId) {
    // Register new player
    const hash = utils.getPlayerHash(playerId);
    db.hmset(hash, 'name', name);
    db.sadd('users', playerId);

    // Make a randomized list of entities and assign them to the player
    const numberOfEntities = 3;
    const numberOfMarkers = 6;
    if (numberOfMarkers < numberOfEntities) { numberOfMarkers = numberOfEntities; }

    db.incrby('entityCount', numberOfEntities, function(err, newEntityCount) {
      var entities = [];
      for (var entityId = newEntityCount - numberOfEntities + 1; entityId < newEntityCount + 1; entityId++) {
        entities.push(entityId);
      }

      for (var i = entities.length; i < numberOfMarkers; i++) {
        entities.push(0);
      }
      entities = utils.shuffle(entities);
      db.hmset(hash, 'entities', JSON.stringify(entities));
    });

    const statusCode = 201;
    const response = {
      playerId: playerId
    };

    res.status(statusCode).send(response);
  });
});

app.get('/entity/:entityId', (req, res) => {
  const entityId = req.params.entityId;
  hash = utils.getEntityHash(entityId);
  db.hgetall(hash, function(err, entityInfo) {
    var statusCode = 404;
    if (entityInfo === null) {
      res.status(statusCode).send();
      return;
    }
    statusCode = 200;
    var response = entityInfo;
    res.status(statusCode).send(response);
  });
});

app.put('/entity/:entityId', (req, res) => {
  const entityId = req.params.entityId;
  const keys = Object.keys(req.body);
  var args = [];
  keys.forEach(key => {
    args.push(key);
    args.push(req.body[key]);
  })
  const hash = utils.getEntityHash(entityId);
  db.hmset(hash, args);

  res.status(200).send();
});

app.post('/entity/send', (req, res) => {
  const fromPlayerId = req.body.playerId;
  const entityId = req.body.entityId;

  // Update the entity list for this player
  const fromHash = utils.getPlayerHash(fromPlayerId);
  db.hmget(fromHash, 'entities', function(err, entities) {
    // Return if user not found
    var statusCode = 400;
    if (entities[0] === null) {
      res.status(statusCode).send();
      return;
    }
    entities = JSON.parse(entities);
    const entityIndex = entities.indexOf(entityId);
    // Return if entity not found on user
    if (entityIndex == -1) {
      statusCode = 409;
      res.status(statusCode).send();
      return;
    }

    // Remove entity from player
    entities[entityIndex] = 0;
    db.hmset(fromHash, 'entities', JSON.stringify(entities));

    // Add entity to another player
    utils.addEntityToRandomPlayer(db, entityId, fromPlayerId);
    statusCode = 200;
    res.status(200).send();
  });
});

app.get('/entities/:playerId', (req, res) => {
  const hash = utils.getPlayerHash(req.params.playerId);
  db.hmget(hash, 'entities', function(err, entities) {
    var statusCode = 404;
    if (entities[0] !== null) {
      statusCode = 200;
    }

    var response;
    switch (statusCode) {
      case 200:
        response = {
          entities: JSON.parse(entities)
        }
        break;
      default:
      case 404:
        break;
    }
      res.status(statusCode).send(response);
  });
});