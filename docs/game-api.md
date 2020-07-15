# The Game API

## GET `/player/:playerId`

Get all available information about the given player.

### Responses

#### 200 OK
```json
{
  "name": "player-name",
  "entities": [],
}
```

#### 400 `name` was not provided

#### 410 Player does not exist


## PUT `/player/:playerId`
Add or update player information. Accepts all field names except `entities`.

### Request
```json
{
  "name": "JP",
  "place": "Narnia"
}
```

### Responses
#### 200 OK
#### 410 User does not exist

## POST `/player/add`

The game client should call this endpoint once.
The desired player name is passed in the request body, and then the assigned unique `playerId` is returned.

### Request
```json
{
  "name": "your-new-username"
}
```

### Responses

#### 201 Player created
Returns the new `playerId`.

```json
{
  "playerId": 2
}
```

#### 406 Username not allowed (not implemented)

#### 409 Username already in use (not implemented)


## GET `/entity/:entityId`

Get all available information about the given entity.

### Responses

#### 200 OK

```json
{
  "entityId": 13,
  "color": "#f00",
  "glft": "magnemite"
}
```

#### 410 No entity information available
The entity does not exist, or the entity exists but there are no information about it.


## PUT `/entity/:entityId`
Add or update entity information. Accepts all field names.

### Request
```json
{
  "color": "#f00",
  "gltf": "magnemite"
}
```

### Responses
#### 200 OK
#### 410 Entity does not exist


## POST `/entity/send`

Send an entity to another player.

### Request

Specify entity to send and the player sending the entity.

```json
{
  "playerId": int,
  "entityId": int
}
```

Might be implemented: `receivingPlayerId`, to allow the sender to specify the receiver.

### Responses

#### 200 OK
The entity was removed from you and assigned to another player.

Might be implemented: Returning the player who got the entity.

#### 405 No players available to receive the entity

#### 406 Game not started or game over

#### 409 Can't send this entity
You don't own the specified entity, or the entity does not exist.

#### 410 Player does not exist


## GET `/entities/:playerId`

Get the entities assigned to a given player

### Responses

#### 200 Player exists, return entities

```json
{
    "entities": [
        3,
        0,
        2,
        0,
        4,
        5
    ]
}
```

#### 410 Player does not exist


## POST `/entities/compare`

Check if the entities passed along are the correct entities.

### Request
```json
{
  "playerId": 2,
  "entities": [
    4,
    0,
    0,
    5,
    6,
    0
  ]
}
```

### Responses

#### 200 OK
If the `entities` from the client match the `entities` on the server:
```json
{
  "match": true
}
```

If the `entities` from the client *does not* match the `entities` on the server, respond with the `entities` array from the server:
```json
{
  "match": false,
  "entities": [
    4,
    0,
    0,
    5,
    6,
    0
  ]
}
```

#### 410 Player does not exist


## GET `/game/scores`
Get the current scores from all registered players.

### Responses
#### 200 OK
```json
{
    "scores": [
        {
            "player": {
              "playerId": 3,
              "name": "JP"
            },
            "score": -2,
            "entities": [
                0,
                0,
                1,
                3,
                0,
                0
            ]
        },
        ...
    ]
}
```

## GET `/game/status`
Get the current overall status of the game.

### Responses
#### 200 OK

`status` can be one of the following:
* `not-started`
* `started`
* `game-over`

```json
{
  "status": "game-over"
}
```

## GET `/game/flushall`
Flush Redis. Remove all users and entities, restart the game.

### Responses
#### 200 OK