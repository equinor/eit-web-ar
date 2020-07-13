exports.getPlayerHash = function(playerId) {
  return 'player:' + playerId;
}
exports.getEntityHash = function(entityId) {
  return 'entityId:' + entityId;
}

exports.addEntityToRandomPlayer = function(storage, entityId, fromPlayerId) {
  storage.smembers('playersAvailable', function(err, playersAvailable) {
    // Get random playerId of available players except self
    const myIndex = playersAvailable.indexOf(String(fromPlayerId));
    playersAvailable.splice(myIndex, 1);
    const toPlayerId = playersAvailable[Math.floor(Math.random()*playersAvailable.length)];
    const toHash = exports.getPlayerHash(toPlayerId);

    // Insert entity into random empty space on the receiving player
    storage.hmget(toHash, 'entities', function(err, entities) {
      entities = JSON.parse(entities);
      var spaces = [];
      for (var i = 0; i < entities.length; i++) {
        if (entities[i] == 0) {
          spaces.push(i);
        }
      }
      spaces = exports.shuffle(spaces);
      const space = spaces[0];
      entities[space] = entityId;

      storage.hmset(toHash, 'entities', JSON.stringify(entities));
      
      // Remove receiving player from availablePlayers if full entity list
      if (entities.indexOf(0) == -1) {
        storage.srem('playersAvailable', toPlayerId);
      }
    });
  });
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