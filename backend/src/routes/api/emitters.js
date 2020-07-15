var storage = require('../../modules/storage');

function emitters.emitEntitiesUpdated(io, playerId, entities) {
  io.emit('entities-updated', {
    playerId: playerId,
    entities: entities
  });
});

function emitters.emitPlayerAdded(io, playerId, name) {
  io.emit('player-added', {
    playerId: playerId,
    name: name
  });
}

function emitters.emitGameStarted(io) {
  io.emit('status-change', {
    status: "running"
  });
}

function emitters.emitEntitiesUpdated(io, playerId, entities) {
  io.emit('entities-updated', {
    playerId: playerId,
    entities: entities
  });
}

function emitters.emitGameOver(io) {
  io.emit('status-change', {
    status: 'game-over'
  });
}


function emitters.emitEntitySent(io, fromPlayerId, toPlayerId) {
  const multi = [
    ['hget', utils.getPlayerHash(fromPlayerId), 'name'],
    ['hget', utils.getPlayerHash(toPlayerId), 'name']
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
    });
  });
}

module.exports = emitters;