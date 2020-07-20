# The Meeting API

## GET `/user/:userId`
Get all available information about a user.

### Responses
#### 200
```json
{
  "name": "username"
}
```

#### 410 User does not exist

## PUT `/user/:userId`
Add or update user information. Accepts all field names.

When updating the group, the corresponding group will also be altered.

### Request
```json
{
  "name": "Odd-Sofie",
  "country": "Krakozhia",
  "group": 3
}
```

### Responses
#### 200 User updated
#### 410 User does not exist

## POST `/user`
Add a user. Returns the new unique userId

### Request
```json
{
  "name": "JP",
  "phone": "81541001"
}
```

### Responses
#### 201 User created
Returns the new `userId`:
```json
{
  "userId": 3
}
```

## DELETE `/user/:userId`
Delete the user and corresponding information
### Responses
#### 200 User deleted
#### 410 User does not exist

## GET `/group/:groupId`
Get information about a group and the players within the group
### Responses
#### 200
```json
{
  "position": {
    "latitude": "50.42322",
    "longitude": "10.39289"
  },
  "radius": 5,
  "users": [
    1,
    3,
    4
  ]
}
```

#### 410 Group does not exist

## POST `/group`
Add new group.
### Request
```json
{
  "latitude": 50.345345,
  "longitude": 32.23244,
  "radius": 4,
  "color": "yellow"
}
```
### Responses
#### 201 Group added

## PUT `/group/:groupId`
Update group information
### Request
```json
{
  "radius": 4
}
```
### Responses
#### 200 Group updated
#### 410 Group does not exist

## DELETE `/group/:groupId`
Delete a group and remove information related to the group.
### Responses
#### 200 Group deleted
#### 410 Group does not exist

## GET `/meeting`
Get all available information about everything
### Responses
#### 200
```json
{
  "...": "?"
}
```

## PUT `/meeting/reset`
Flush Redis.
### Responses
#### 200 Reset done