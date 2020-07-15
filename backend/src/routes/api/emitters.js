var storage = require('../../modules/storage');

module.exports = {
  
  emitEntitiesUpdated: function(io, playerId, entities) {
    io.emit('entities-updated', {
      playerId: playerId,
      entities: entities
    });
  },

  emitPlayerAdded: function(io, playerId, name) {
    io.emit('player-added', {
      playerId: playerId,
      name: name
    });
  },

  emitGameStarted: function(io) {
    io.emit('status-change', {
      status: "running"
    });
  },

  emitEntitiesUpdated: function(io, playerId, entities) {
    io.emit('entities-updated', {
      playerId: playerId,
      entities: entities
    });
  },

  emitGameOver: function(io) {
    io.emit('status-change', {
      status: 'game-over'
    });
  },

  emitEntitySent: function(io, fromPlayerId, toPlayerId) {
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
};