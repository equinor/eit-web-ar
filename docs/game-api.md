# The Game API

## GET `/player/:playerId`

Get all available information about the given player

### Responses

#### 200 OK
```json
{
  "name": "player-name",
  "entities": [],
}
```

#### 400 Bad request
`name` was not provided.

#### 410 Gone
The player does not exist


## PUT `/player/:playerId`
Add or update player information. Accepts all field names.

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

The game client should call the `/player/add` endpoint once.
The desired username is passed in the request body, and then the assigned unique playerId is returned.

### Request
```json
{
  "name": "your-new-username"
}
```

### Responses

#### 201 Created
The user was created, return the new playerId

```json
{
  "playerId": int
}
```

#### 409 Conflict (not implemented)
Username already in use

#### 406 Not acceptable (not implemented)
Username is an empty string


## GET `/entity/:entityId`

Get all available information about the given entity.
Not very useful until the possibility to change color, material, gltf, etc. is implemented.

### Responses

#### 200 OK

```json
{
  "entityId": int,
  "color": "#f00",
  "glft": "magnemite"
}
```

#### 410 Gone
The entity does not exist, or the entity exists, but there are no information about it.


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


## POST `/entity/send`

Send an entity from yourself to another player.

### Request

Specify entity to send and your playerId

```json
{
  "playerId": int,
  "entityId": int
}
```

Might be implemented: `receivingPlayerId`, to allow the sender to specify the receiver.

### Responses

#### 200 OK
The entity was removed from you and assigned to another player

Might be implemented: Returning the player who got the entity.

#### 410 Gone
The user does not exist.

#### 409 Conflict
You don't own the specified entity (or the entity does not exist).


## GET `/entities/:playerId`

Get the entities assigned to a given player

### Responses

#### 200 OK
The user exists, return entities.

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

#### 410 Gone
User does not exist.


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

#### 410 Gone
Player does not exist


## GET `/scores`
Get the current scores from all registered players

### Responses
#### 200 OK
```json
{
    "scores": [
        {
            "playerId": "1",
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

## GET `/gamestatus`
Get the current overall status of the game.

### Responses
#### 200 OK

`status` can be one of the following:
* `not-started`
* `running`
* `game-over`

```json
{
  "status": "game-over"
}
```