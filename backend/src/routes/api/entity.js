var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

var utils = require('./utils');
var emitters = require('./emitters');

/**********************************************************************************
* GET
*/

router.get('/', function (req, res) {
  let defaultData = {
    description: "entity api"
  };
  res.status(200).json(defaultData);
});

router.get('/:entityId', (req, res) => {
  const entityId = req.params.entityId;
  hash = utils.getEntityHash(entityId);
  storage.hgetall(hash, function(err, entityInfo) {
    if (entityInfo === null) {
      res.status(410).send();
      return;
    }
    res.status(200).send(entityInfo);
  });
});

/**********************************************************************************
* PUT
*/

router.put('/:entityId', (req, res) => {
  const entityId = req.params.entityId;
  const keys = Object.keys(req.body);
  storage.sismember('entities', entityId, function(err, entityExists) {
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
    storage.hmset(hash, args);

    res.status(200).send();
  });
});

/**********************************************************************************
* POST
*/

router.post('/send', (req, res) => {
  const fromPlayerId = req.body.playerId;
  const entityId = req.body.entityId;
  const io = req.app.get('io');

  const fromHash = utils.getPlayerHash(fromPlayerId);
  storage.hget(fromHash, 'entities', function(err, entities) {
    if (entities === null) {
      res.status(410).send();
      return;
    }
    entities = JSON.parse(entities);
    const entityIndex = entities.indexOf(entityId);
    if (entityIndex == -1) {
      res.status(409).send();
      return;
    }
    anyOtherPlayersAvailable(fromPlayerId, function(anyOthersAvailable) {
      if (!anyOthersAvailable) {
        res.status(400).send();
        return;
      }
      entities[entityIndex] = 0;
      updatePlayerEntities(fromPlayerId, entities);
      utils.makePlayerAvailable(fromPlayerId);
      emitters.emitEntitiesUpdated(io, fromPlayerId, entities);
      
      if (isEntitiesEmpty(entities)) {
        stopGame();
        emitters.emitGameOver(io);
      }

      addEntityToRandomPlayer(entityId, fromPlayerId, function(toPlayerId, entities) {
        if (entities.indexOf(0) == -1) {
          utils.makePlayerUnavailable(toPlayerId);
        }
        emitters.emitEntitiesUpdated(io, toPlayerId, entities);
        emitters.emitEntitySent(io, fromPlayerId, toPlayerId, entityId);
      });
      
      res.status(200).send();
    });
  });
});

/**********************************************************************************
* SUPPORT FUNCS ...which maybe ought to be separated out into modules that hande specific parts of the business logic...
*/

function handleError(res, message){
   console.log(message);
   res.status(500).send(message);
}

function isEntitiesEmpty(entities) {
  for (var i = 0; i < entities.length; i++) {
    if (entities[i] != 0) {
      return false;
    }
  }
  return true;
}

function addEntityToRandomPlayer(entityId, fromPlayerId, callback) {
  storage.smembers('playersAvailable', function(err, playersAvailable) {
    // Get random playerId of available players except self
    const myIndex = playersAvailable.indexOf(String(fromPlayerId));
    if (myIndex != -1) {
      playersAvailable.splice(myIndex, 1);
    }
    const toPlayerId = playersAvailable[Math.floor(Math.random()*playersAvailable.length)];
    const toHash = utils.getPlayerHash(toPlayerId);

    // Insert entity into random empty space on the receiving player
    storage.hmget(toHash, 'entities', function(err, entities) {
      entities = JSON.parse(entities);
      var spaces = [];
      for (var i = 0; i < entities.length; i++) {
        if (entities[i] == 0) {
          spaces.push(i);
        }
      }
      spaces = utils.shuffle(spaces);
      const space = spaces[0];
      entities[space] = entityId;

      storage.hmset(toHash, 'entities', JSON.stringify(entities));
      
      callback(toPlayerId, entities);
    });
  });
}

function updatePlayerEntities(playerId, entities) {
  storage.hmset(utils.getPlayerHash(playerId), 'entities', JSON.stringify(entities));
}

function stopGame() {
  storage.set('gamestatus', 'game-over');
}

function anyOtherPlayersAvailable(playerId, callback) {
  storage.smembers('playersAvailable', function(err, playersAvailable) {
    const myIndex = playersAvailable.indexOf(String(playerId));
    if (myIndex != -1) {
      playersAvailable.splice(myIndex, 1);
    }
    
    var anyOthersAvailable = (playersAvailable.length > 0);
    callback(anyOthersAvailable);
  });
}

/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;