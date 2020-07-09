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

app.get('/player/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  hash = getPlayerHash(playerId);
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

app.post('/player/add', (req, res) => {
  const name = req.body.name;
  db.incr('playerCount', function(err, playerId) {
    // Register new player
    const hash = getPlayerHash(playerId);
    db.hmset(hash, 'name', name);

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
      entities = shuffle(entities);
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
  hash = getEntityHash(entityId);
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

app.post('/entity/send', (req, res) => {
  const fromPlayerId = req.body.playerId;
  const entityId = req.body.entityId;

  // Update the entity list for this player
  const fromHash = getPlayerHash(fromPlayerId);
  db.hmget(fromHash, 'entities', function(err, entities) {
    // Return if user not found
    var statusCode = 404;
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
    addEntityToNextPlayer(entityId, fromPlayerId);
    statusCode = 200;
    res.status(200).send();
  });
});

app.get('/entities/:playerId', (req, res) => {
  const hash = getPlayerHash(req.params.playerId);
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

app.listen(port, () => {
  console.log('API listening on port ' + port);
});


function getPlayerHash(playerId) {
  return 'player:' + playerId;
}
function getEntityHash(entityId) {
  return 'entityId:' + entityId;
}

function addEntityToNextPlayer(entityId, fromPlayerId) {
  db.get('playerCount', function(err, playerCount) {
    toPlayerId = (fromPlayerId) % (playerCount) + 1;
    const toHash = getPlayerHash(toPlayerId);

    // Insert entity into random empty space on the receiving player
    db.hmget(toHash, 'entities', function(err, entities) {
      entities = JSON.parse(entities);
      var spaces = [];
      for (var i = 0; i < entities.length; i++) {
        if (entities[i] == 0) {
          spaces.push(i);
        }
      }
      spaces = shuffle(spaces);
      const space = spaces[0];
      entities[space] = entityId;

      db.hmset(toHash, 'entities', JSON.stringify(entities));
    });
  });
}

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