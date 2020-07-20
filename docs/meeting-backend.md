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
user:3 name Victor country Krakozhia
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