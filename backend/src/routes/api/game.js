var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

var utils = require('./utils');

/**********************************************************************************
* GET
*/

router.get('/scores', (req, res) => {
  storage.smembers('players', function(err, players) {
    var multi = [];
    for (var i = 0; i < players.length; i++) {
      multi.push([
        'hmget',
        utils.getPlayerHash(players[i]),
        'name',
        'entities'
      ]);
    }
    storage.multi(multi).exec(function(err, playerInfoFromAll) {
      var scores = [];
      for (var i = 0; i < players.length; i++) {
        var playerId = players[i];
        var name = playerInfoFromAll[i][0];
        var entities = JSON.parse(playerInfoFromAll[i][1]);
        var score = utils.getScore(entities);
        scores.push({
          player: {
            playerId: playerId,
            name: name
          },
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

router.get('/status', (req, res) => {
  storage.get('gamestatus', function(err, status) {
    if (status === null) {
      status = 'not-started';
    }
    const response = {
      status: status
    };
    res.status(200).send(response);
  })
});

router.get('/flushall', (req, res) => {
  storage.flushall();
  res.status(200).send();
});


/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;