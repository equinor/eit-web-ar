var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');


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
  let hash = getPlayerHash(playerId);
  
  storage.hgetall(hash, function (err, playerInfo) {
    let statusCode = 200;
    if (playerInfo === null) {
      // Not found
      statusCode = 404;
      res.status(statusCode).send();
    } else {
      // Success
      res.status(statusCode).json(playerInfo);
    }
  });
});


/**********************************************************************************
 * POST
 */

router.post('/add', (req, res) => {
  const name = req.body.name;
  storage.incr('playerCount', function (err, playerId) {
    // Register new player
    const hash = getPlayerHash(playerId);
    storage.hmset(hash, 'name', name);

    // Make a randomized list of entities and assign them to the player
    const numberOfEntities = 3;
    const numberOfMarkers = 6;
    if (numberOfMarkers < numberOfEntities) { numberOfMarkers = numberOfEntities; }

    storage.incrby('entityCount', numberOfEntities, function (err, newEntityCount) {
      var entities = [];
      for (var entityId = newEntityCount - numberOfEntities + 1; entityId < newEntityCount + 1; entityId++) {
        entities.push(entityId);
      }

      for (var i = entities.length; i < numberOfMarkers; i++) {
        entities.push(0);
      }
      entities = shuffle(entities);
      storage.hmset(hash, 'entities', JSON.stringify(entities));
    });

    const statusCode = 201;
    const response = {
      playerId: playerId
    };

    res.status(statusCode).json(response);
  });
});



/**********************************************************************************
 * SUPPORT FUNCS ...which maybe ought to be separated out into modules that hande specific parts of the business logic...
 */

function getPlayerHash(playerId) {
  return 'player:' + playerId;
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


/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;
