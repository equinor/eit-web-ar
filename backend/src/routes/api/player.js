var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

var utils = require('./utils');

const numberOfEntities = 3;
const numberOfMarkers = 6;
if (numberOfMarkers < numberOfEntities) {
  numberOfMarkers = numberOfEntities;
}

/**********************************************************************************
* GET
*/

router.get('/', function (req, res) {
  let statusCode = 200;
  let defaultData = {
    description: "player api"
  };
  res.status(statusCode).json(defaultData);
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
    var playerId = 1;
    if (lastPlayerId !== null) {
      playerId = lastPlayerId + 1;
    }
    // Register new player
    const hash = utils.getPlayerHash(playerId);
    storage.hmset(hash, 'name', name);
    storage.sadd('players', playerId);
    storage.sadd('playersAvailable', playerId);

    // Make a randomized list of entities and assign them to the player
    storage.scard('entities', function(err, entityCount) {
      if (entityCount === null) {
        entityCount = 0;
      }
      var entities = [];
      for (var entityId = entityCount + 1; entityId < entityCount + numberOfEntities + 1; entityId++) {
        entities.push(entityId);
      }
      storage.sadd('entities', entities);

      for (var i = entities.length; i < numberOfMarkers; i++) {
        entities.push(0);
      }
      entities = utils.shuffle(entities);
      storage.hmset(hash, 'entities', JSON.stringify(entities));
    });

    // Start the game when there are two players
    if (playerId == 2) {
      storage.set('gamestatus', 'running');
    }
    
    io.emit('player-added', {
      playerId: playerId,
      name: name
    })

    const response = {
      playerId: playerId
    };
    res.status(201).send(response);
  });
});


/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;
