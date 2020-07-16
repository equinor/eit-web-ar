var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

var game = require('../../modules/game');
var utils = require('./utils');
var emitters = require('./emitters');

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
    utils.makePlayerAvailable(playerId);
    
    utils.createEntityList(function(entities) {
      if (req.body.model !== undefined) {
        const model = req.body.model;
        setPropertyOnEntities(entities, 'model', model);
      }
      if (req.body.color !== undefined) {
        const color = req.body.color;
        setPropertyOnEntities(entities, 'color', color);
      }
      
      utils.addEntitiesToPlayer(playerId, entities);
      emitters.emitEntitiesUpdated(io, playerId, entities);
    });
    
    emitters.emitPlayerAdded(io, playerId, name);

    // Start the game when there are two players
    if (playerId == 2) {
      utils.startGame();
      emitters.emitGameStarted(io);
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

function setPropertyOnEntities(entities, property, content) {
  for (var i = 0; i < entities.length; i++) {
    var entityHash = utils.getEntityHash(entities[i]);
    storage.hset(entityHash, property, content);
  }
}

/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;
