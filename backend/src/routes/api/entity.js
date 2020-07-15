var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

var utils = require('./utils');

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

  // Update the entity list for this player
  const fromHash = utils.getPlayerHash(fromPlayerId);
  storage.hget(fromHash, 'entities', function(err, entities) {
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
    storage.hmset(fromHash, 'entities', JSON.stringify(entities));
    
    storage.sadd('playersAvailable', fromPlayerId);
    
    io.emit('entities-updated', {
      playerId: fromPlayerId,
      entities: entities
    });
    
    // Game over if the sending player doesn't have any entities left
    var gameOver = true;
    console.log(entities);
    for (var j = 0; j < entities.length; j++) {
      if (entities[j] != 0) {
        gameOver = false;
        break;
      }
    }
    if (gameOver) {
      io.emit('status-change', {
        status: 'game-over'
      });
    }

    // Add entity to another player
    utils.addEntityToRandomPlayer(storage, entityId, fromPlayerId, function(toPlayerId, entities) {
      io.emit('entities-updated', {
        playerId: toPlayerId,
        entities: entities
      });
      
      // Send entity-sent websocket event
      const multi = [
        [
          'hget',
          utils.getPlayerHash(fromPlayerId),
          'name'
        ],
        [
          'hget',
          utils.getPlayerHash(toPlayerId),
          'name'
        ]
      ];
      storage.multi(multi).exec(function(err, playerNames) {
        io.emit('entity-sent', {
          fromPlayer: {
            playerId: fromPlayerId,
            name: playerNames[0]
          },
          toPlayer: {
            playerId: toPlayerId,
            name: playerNames[1]
          }
        })
      });
      
    });
    
    res.status(200).send();
  });
});

/**********************************************************************************
* SUPPORT FUNCS ...which maybe ought to be separated out into modules that hande specific parts of the business logic...
*/

function handleError(res, message){
   console.log(message);
   res.status(500).send(message);
}


/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;