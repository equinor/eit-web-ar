# The Meeting Backend

## Redis

### `lastUserId` int
Stores the id of the last registered user. A new unique id can be obtained by incrementing this value.

### `users` set
Stores userId's of the active users
```
3
2
4
1
```

### `user:userId` hash
Stores information about each user
```
user:3 name Victor latitude 59.23232 longitude 10.12221 latitude0 50.3422 longitude0 11.12332 fakeLatitude0 10 fakeLongitude0 10
```

### `lastGroupId` int
Stores the id of the last created group.

### `groups` set
Stores groupId's of the active groups.
```
3
2
1
4
```

### `group:groupId` hash
Stores information about each group
```
group:43 latitude 59.23223 longitude 10.32989 radius 5 users [1, 4, 2]
```

### `lastInteractionId` int
Stores the id of the last created interaction.

### `interactions` set
Stores interactionId's of all interactions.
```
3
2
1
4
```

### `interaction:interactionId` hash
Stores information about each interaction
```
interaction:5 type rocket fromUserId 3 toUserId 17
```

## Socket messages

### Client -> Server: `connect-socket-to-user`
The client have registered a new user and received their userId. Then the client sends the `connect-socket-to-user` to the server so that the server can know which user are connected to which websocket id.
```json
{
  "userId": 18
}
```

### Client -> Server: `position-update`
A user has changed position. Tell the server to update its information. Also, if this is the first position emitted by this user, store the initial position as well.
```json
{
  "latitude": 50.23223,
  "longitude": 10.23222,
  "heading": 157.223
}
```

### Server -> Client: `position-update`
Client received updated positions about all the other players. The coordinates received are manipulated to correspond to positions around the receiving user.

```json
[
  {
    "userId": 1,
    "latitude": 1.33233,
    "longitude": 2.133323,
    "heading": 157.223
  },
  {
    "userId": 2,
    "latitude": 0.3434444,
    "longitude": 4.42322,
    "heading": 157.223
  }
]
```

### Server -> Client: `user-joined`
```json
{
  "userId": 17,
  "name": "Kjell-Frida",
  "geometry": "sphere",
  "color": "#f00",
  "...": "..."
}
```

### Server -> Client `user-left`
```json
{
  "userId": 17,
  "name": "Kjell-Frida"
}
```

### Server -> Client: `user-joined-group`
```json
{
  "userId": 4,
  "groupId": 2
}
```

### Server -> Client: `user-left-group`
```json
{
  "userId": 4,
  "groupId": 2
}
```

### Server -> Client: `interaction-joined`
```json
{
  "type": "rocket",
  "fromUserId": 4,
  "toUserId": 7
}
```

### Client -> Server: `rocket-hit-user`
The user who spawns a rocket listens for collisions. If the rocket hits a user, this message will be sent to the server.

A rocket is an interaction of type "rocket", therefore the rocket will have an `interactionId`.

```json
{
  "interactionId": 3,
  "fromUserId": 4,
  "toUserId": 8
}
```

### Server -> Client: `rocket-hit-user`
When the server gets a message about a rocket hitting a user, it will pass the message along to all users.

Same JSON data as above.

### Client -> Server: `audio-message`
This message is sent from the user who records the audio message.

`userId` specifies the user who sends the audio message. `chunks` is an array with audio information. This array can be converted into a blob.
```json
{
  "userId": 4,
  "chunks": []
}
```
### Server -> Client: `audio-message`
This message is received by all users after a user have recorded an audio message.

Same JSON data as above.