# The Game API

## POST `/register`

The game client should call the `/register` endpoint once.
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

#### 404 Not found
User does not exist.


## POST `/sendEntity`

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

#### 404 Not found
The user does not exist.

#### 409 Conflict
You don't own the specified entity (or the entity does not exist).

## GET `/player/:playerId`

Get all available information about the given player

### Responses

#### 200 OK
```json
{
  "playerId": int,
  "name": "player-name",
  "entities": [],
}
```

#### 404 Not found
The player does not exist

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

#### 404 Not found
The entity does not exist