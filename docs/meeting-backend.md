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
  "longitude": 10.23222
}
```

### Server -> Client: `position-update`
```json
[
  {
    "userId": 1,
    "latitude": 1.33233,
    "longitude": 2.133323
  },
  {
    "userId": 2,
    "latitude": 0.3434444,
    "longitude": 4.42322
  }
]
```

### Server -> Client: `user-joined`
### Server -> Client `user-left`
```json
{
  "userId": 17,
  "name": "Kjell-Frida"
}
```

### Server -> Client: `user-joined-group`
### Server -> Client: `user-left-group`
```json
{
  "userId": 4,
  "groupId": 2
}
```