var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

var utils = require('./utils');

/**********************************************************************************
* GET
*/
 
router.get('/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const hash = utils.getPlayerHash(playerId);
  storage.hget(hash, 'entities', function(err, entities) {
    if (entities === null) {
      res.status(410).send();
      return;
    }
    const response = {
      entities: JSON.parse(entities)
    };
    res.status(200).send(response);
  });
});
 
 
/**********************************************************************************
* POST
*/
 
 
router.post('/compare', (req, res) => {
  const playerId = req.body.playerId;
  const entitiesInput = req.body.entities;
  const hash = utils.getPlayerHash(playerId);
  storage.hget(hash, 'entities', function(err, entities) {
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
    };
    if (!match) {
      response.entities = entities;
    }

    res.status(200).send(response);
  });
});
 
 
 /**********************************************************************************
 * EXPORT MODULE
 */

 module.exports = router;