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

module.exports = emitters;