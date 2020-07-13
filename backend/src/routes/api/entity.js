var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

var utils = require('./utils');



/**********************************************************************************
 * GET
 */

router.get('/', function (req, res) {
   let statusCode = 200;
   let defaultData = {
     description: "entity api"
   };
   res.status(statusCode).json(defaultData);
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

    // Add entity to another player
    utils.addEntityToRandomPlayer(storage, entityId, fromPlayerId);
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

function getEntityHash(entityId) {
   return 'entityId:' + entityId;
}


/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;