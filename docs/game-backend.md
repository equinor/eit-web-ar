# The Game Backend

## Redis

### players set
Stores playerId's of the players who have been active this session. The set can look like:
```redis
4
2
1
3
```

### playersAvailable set
Stores playerId's of the players available for receiving entities. Active players without free spaces on the marker board will *not* be present in this set.
```redis
3
1
```

### player:playerId hash
Stores information about each player. An entry can look like:
```redis
player:3 name Kim city Atlantis
```

### entities set
Stores entityId's of the entities created this session. Can look like this:
```redis
5
2
4
1
3
6
```

### entity:entityId hash
Stores information about each entity. An entry can look like the following:
```redis
entity:9 color #f00 gltf penguin
```

## Websocket events

### `entities-updated`
Sent from the server to the client when an entitiy list is created or updated.

```json
{
  "playerId": 3,
  "entities": [
    4,
    2,
    0,
    1,
    0,
    7
  ]
}
```

### `entity-sent`
An entity has been sent between players.
```json
{
  "fromPlayerId": 3,
  "toPlayerId": 1
}
```

### `player-added`
A new player is registered in The Game.
```json
{
  "playerId": 4,
  "name": "Skandiamannen"
}
```

### `status-change`
Woach, the game status is changed! `status` can be "not-started", "running", or "game-over".
```json
{
  "status": "game-over"
}
```

