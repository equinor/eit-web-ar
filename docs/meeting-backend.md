# The Meeting Backend

## Redis

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

### `group:groupId` hash
Stores information about each group
```
group:43 latitude 59.23223 longitude 10.32989 radius 5 users [1, 4, 2]
```