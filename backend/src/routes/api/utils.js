var storage = require('../../modules/storage');
var game = require('../../modules/game');

exports.getPlayerHash = function(playerId) {
  return 'player:' + playerId;
}
exports.getEntityHash = function(entityId) {
  return 'entityId:' + entityId;
}

exports.shuffle = function(array) {
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

exports.getScore = function(entities) {
  var score = 0;
  for (var i = 0; i < entities.length; i++) {
    if (entities[i] != 0) {
      score--;
    }
  }
  return score;
}

exports.makePlayerAvailable = function(playerId) {
  storage.sadd('playersAvailable', playerId);
}

exports.makePlayerUnavailable = function(playerId) {
  storage.srem('playersAvailable', playerId);
}

exports.createEntityList = function(callback) {
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
    entities = exports.shuffle(entities);
    
    callback(entities);
  });
}

exports.addEntitiesToPlayer = function(playerId, entities) {
  storage.hmset(exports.getPlayerHash(playerId), 'entities', JSON.stringify(entities));
}

exports.startGame = function() {
  storage.set('gamestatus', 'started');
}