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
if (numberOfMarkers < numberOfEntities) {
  numberOfMarkers = numberOfEntities;
}

app.get('/player/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  hash = utils.getPlayerHash(playerId);
  db.hgetall(hash, function(err, playerInfo) {
    if (playerInfo === null) {
      res.status(410).send();
      return;
    }
    playerInfo.entities = JSON.parse(playerInfo.entities);
    res.status(200).send(playerInfo);
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
        return; // Don't allow changes in the entities array
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
    
    const response = {
      playerId: playerId
    };
    res.status(201).send(response);
  });
});

app.get('/entity/:entityId', (req, res) => {
  const entityId = req.params.entityId;
  hash = utils.getEntityHash(entityId);
  db.hgetall(hash, function(err, entityInfo) {
    if (entityInfo === null) {
      res.status(410).send();
      return;
    }
    res.status(200).send(entityInfo);
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
  db.hget(fromHash, 'entities', function(err, entities) {
    // Return if user not found
    if (entities === null) {
      res.status(410).send();
      return;
    }
    entities = JSON.parse(entities);
    const entityIndex = entities.indexOf(entityId);
    // Return if entity not found on user
    if (entityIndex == -1) {
      res.status(409).send();
      return;
    }

    // Remove entity from player
    entities[entityIndex] = 0;
    db.hmset(fromHash, 'entities', JSON.stringify(entities));
    
    db.sadd('playersAvailable', fromPlayerId);

    // Add entity to another player
    utils.addEntityToRandomPlayer(db, entityId, fromPlayerId);
    res.status(200).send();
  });
});

app.get('/entities/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const hash = utils.getPlayerHash(playerId);
  db.hget(hash, 'entities', function(err, entities) {
    if (entities === null) {
      res.status(410).send();
      return;
    }
    const response = {
      entities: JSON.parse(entities)
    }
    res.status(200).send(response);
  });
});

app.post('/entities/compare', (req, res) => {
  const playerId = req.body.playerId;
  const entitiesInput = req.body.entities;
  const hash = utils.getPlayerHash(playerId);
  db.hget(hash, 'entities', function(err, entities) {
    if (entities === null) {
      res.status(410).send();
      return;
    }
    entities = JSON.parse(entities);
    
    var match = true;
    for (var i = 0; i < entities.length; i++) {
      if (entitiesInput[i] != entities[i]) {
        match = false;
        break;
      }
    }
    
    var response = {
      "match": match
    }
    if (!match) {
      response.entities = entities;
    }
    
    res.status(200).send(response);
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
      res.status(200).send(response);
    })
  });
});

app.get('/gamestatus', (req, res) => {
  db.get('gamestatus', function(err, status) {
    if (status === null) {
      status = 'not-started';
    }
    const response = {
      status: status
    };
    res.status(200).send(response);
  })
});