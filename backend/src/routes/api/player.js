var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

var game = require('../../modules/game');
var utils = require('./utils');

/**********************************************************************************
* GET
*/

router.get('/', function (req, res) {
  let defaultData = {
    description: "player api"
  };
  res.status(200).json(defaultData);
});

router.get('/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  hash = utils.getPlayerHash(playerId);
  storage.hgetall(hash, function(err, playerInfo) {
    if (playerInfo === null) {
      res.status(410).send();
      return;
    }
    playerInfo.entities = JSON.parse(playerInfo.entities);
    res.status(200).send(playerInfo);
  });
});

/**********************************************************************************
* PUT
*/

router.put('/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const keys = Object.keys(req.body);
  storage.sismember('players', playerId, function(err, playerExists) {
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
      storage.hmset(hash, args);
    }
    res.status(200).send();
  });
});


/**********************************************************************************
* POST
*/

router.post('/add', (req, res) => {
  const name = req.body.name;
  if (name === undefined) {
    res.status(400).send();
    return;
  }
  storage.scard('players', function(err, lastPlayerId) {
    const io = req.app.get('io');
    var playerId = getNextPlayerId(lastPlayerId);
    addPlayer(playerId, name);
    makePlayerAvailable(playerId);
    
    createEntityList(function(entities) {
      addEntitiesToPlayer(playerId, entities);
      emitEntitiesUpdated(playerId, entities);
    });
    
    emitPlayerAdded(playerId, name);

    // Start the game when there are two players
    if (playerId == 2) {
      startGame();
      emitGameStarted();
    }
    
    const response = {
      playerId: playerId
    };
    res.status(201).send(response);
  });
});

/*
* Helpers
*/

function getNextPlayerId(lastPlayerId) {
  var nextPlayerId = 1;
  if (lastPlayerId !== null) {
    nextPlayerId = lastPlayerId + 1;
  }
  return nextPlayerId;
}

function addPlayer(playerId, name) {
  const hash = utils.getPlayerHash(playerId);
  storage.hmset(hash, 'name', name);
  storage.sadd('players', playerId);
}

function makePlayerAvailable(playerId) {
  storage.sadd('playersAvailable', playerId);
}

function createEntityList(callback) {
  storage.scard('entities', function(err, entityCount) {
    if (entityCount === null) {
      entityCount = 0;
    }
    var entities = [];
    for (var entityId = entityCount + 1; entityId < entityCount + game.numberOfEntities + 1; entityId++) {
      entities.push(entityId);
    }
    storage.sadd('entities', entities);

    for (var i = entities.length; i < game.numberOfMarkers; i++) {
      entities.push(0);
    }
    entities = utils.shuffle(entities);
    
    callback(entities);
  });
}

function addEntitiesToPlayer(playerId, entities) {
  storage.hmset(getPlayerHash(playerId), 'entities', JSON.stringify(entities));
}

function startGame() {
  storage.set('gamestatus', 'running');
}

function emitEntitiesUpdated(playerId, entities) {
  io.emit('entities-updated', {
    playerId: playerId,
    entities: entities
  });
});

function emitPlayerAdded(playerId, name) {
  io.emit('player-added', {
    playerId: playerId,
    name: name
  });
}

function emitGameStarted() {
  io.emit('status-change', {
    status: "running"
  });
}

/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;
