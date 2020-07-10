var utils = require("./utils");

const express = require('express');
const cors = require('cors')
const redis = require('redis');

const port = 3001;

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

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

const numberOfEntities = 3;
const numberOfMarkers = 6;

app.get('/player/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  hash = utils.getPlayerHash(playerId);
  db.hgetall(hash, function(err, playerInfo) {
    var statusCode = 410;
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
  db.sismember('players', playerId, function(err, playerExists) {
    if (!playerExists) {
      res.status(410).send();
      return;
    }
    var args = [];
    keys.forEach(key => {
      if (key == 'entities') {
        // Don't allow changes in the entities array
        return;
      }
      args.push(key);
      args.push(req.body[key]);
    })
    if (args.length > 0) {
      const hash = utils.getPlayerHash(playerId);
      db.hmset(hash, args);
    }

    res.status(200).send();
  });
});

app.post('/player/add', (req, res) => {
  const name = req.body.name;
  if (name === undefined) {
    res.status(400).send();
    return;
  }
  db.scard('players', function(err, lastPlayerId) {
    var playerId = 1;
    if (lastPlayerId !== null) {
      playerId = lastPlayerId + 1;
    }
    // Register new player
    const hash = utils.getPlayerHash(playerId);
    db.hmset(hash, 'name', name);
    db.sadd('players', playerId);
    db.sadd('playersAvailable', playerId);

    // Make a randomized list of entities and assign them to the player
    if (numberOfMarkers < numberOfEntities) { numberOfMarkers = numberOfEntities; }

    db.scard('entities', function(err, entityCount) {
      if (entityCount === null) {
        entityCount = 0;
      }
      var entities = [];
      for (var entityId = entityCount + 1; entityId < entityCount + numberOfEntities + 1; entityId++) {
        entities.push(entityId);
      }
      db.sadd('entities', entities);

      for (var i = entities.length; i < numberOfMarkers; i++) {
        entities.push(0);
      }
      entities = utils.shuffle(entities);
      db.hmset(hash, 'entities', JSON.stringify(entities));
    });
    
    // Start the game when there are two players
    if (playerId == 2) {
      db.set('gamestatus', 'running');
    }

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
    var statusCode = 410;
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
  db.sismember('entities', entityId, function(err, entityExists) {
    if (!entityExists) {
      res.status(410).send();
      return;
    }
    var args = [];
    keys.forEach(key => {
      args.push(key);
      args.push(req.body[key]);
    })
    const hash = utils.getEntityHash(entityId);
    db.hmset(hash, args);

    res.status(200).send();
  });
});

app.post('/entity/send', (req, res) => {
  const fromPlayerId = req.body.playerId;
  const entityId = req.body.entityId;

  // Update the entity list for this player
  const fromHash = utils.getPlayerHash(fromPlayerId);
  db.hmget(fromHash, 'entities', function(err, entities) {
    // Return if user not found
    var statusCode = 410;
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
    // Add player to availablePlayers if not present already
    db.sadd('playersAvailable', fromPlayerId);

    // Add entity to another player
    utils.addEntityToRandomPlayer(db, entityId, fromPlayerId);
    statusCode = 200;
    res.status(200).send();
  });
});

app.get('/entities/:playerId', (req, res) => {
  const hash = utils.getPlayerHash(req.params.playerId);
  db.hmget(hash, 'entities', function(err, entities) {
    var statusCode = 410;
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
      case 410:
        break;
    }
      res.status(statusCode).send(response);
  });
});

app.post('/entities/compare', (req, res) => {
  const playerId = req.body.playerId;
  const entitiesInput = req.body.entities;
  const hash = utils.getPlayerHash(playerId);
  db.hget(hash, 'entities', function(err, entities) {
    var statusCode = 410;
    if (entities === null) {
      res.status(statusCode).send();
      return;
    }
    statusCode = 200;
    entities = JSON.parse(entities);
    
    var match = true;
    for (var i = 0; i < entities.length; i++) {
      if (entitiesInput[i] != entities[i]) {
        match = false;
        break;
      }
    }
    
    var response;
    if (match) {
      response = {
        "match": match
      };
    } else {
      response = {
        "match": match,
        "entities": entities
      };
    }
    
    res.status(statusCode).send(response);
  });
});

app.get('/scores', (req, res) => {
  db.smembers('players', function(err, players) {
    var multi = [];
    for (var i = 0; i < players.length; i++) {
      multi.push([
        'hget',
        utils.getPlayerHash(players[i]),
        'entities'
      ]);
    }
    db.multi(multi).exec(function(err, entitiesFromAll) {
      var scores = [];
      for (var i = 0; i < players.length; i++) {
        var playerId = players[i];
        var entities = JSON.parse(entitiesFromAll[i]);
        var score = utils.getScore(entities);
        scores.push({
          playerId: playerId,
          score:    score,
          entities: entities
        })
      }
      const response = {
        scores: scores
      };
      const statusCode = 200;
      res.status(statusCode).send(response);
    })
  });
});

app.get('/gamestatus', (req, res) => {
  db.get('gamestatus', function(err, status) {
    if (status === null) {
      status = 'not-started';
    }
    const statusCode = 200;
    const response = {
      status: status
    };
    res.status(statusCode).send(response);
  })
});