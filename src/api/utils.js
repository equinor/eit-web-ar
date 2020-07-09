exports.getPlayerHash = function(playerId) {
  return 'player:' + playerId;
}
exports.getEntityHash = function(entityId) {
  return 'entityId:' + entityId;
}

exports.addEntityToNextPlayer = function(db, entityId, fromPlayerId) {
  db.get('playerCount', function(err, playerCount) {
    toPlayerId = (fromPlayerId) % (playerCount) + 1;
    const toHash = getPlayerHash(toPlayerId);

    // Insert entity into random empty space on the receiving player
    db.hmget(toHash, 'entities', function(err, entities) {
      entities = JSON.parse(entities);
      var spaces = [];
      for (var i = 0; i < entities.length; i++) {
        if (entities[i] == 0) {
          spaces.push(i);
        }
      }
      spaces = shuffle(spaces);
      const space = spaces[0];
      entities[space] = entityId;

      db.hmset(toHash, 'entities', JSON.stringify(entities));
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