# The Meeting API

## GET `/users`
Get all available information about all users.

### Responses
#### 200
```json
[
  {
    "userId": 1,
    "name": "Kaostrollet"
  },
  {}
]
```

## GET `/user/:userId`
Get all available information about a user.

### Responses
#### 200
```json
{
  "name": "username"
}
```

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
Add a user.

### Request
```json
{
  "name": "JP",
  "phone": "81541001"
}
```

### Responses
#### 201 User created
Returns the new `userId` and the properties stored:
```json
{
  "userId": 3,
  "name": "JP",
  "phone": "81541001"
}
```

## DELETE `/user/:userId`
Delete the user and corresponding information
### Responses
#### 200 User deleted
#### 410 User does not exist

## GET `/group/:groupId`

Be aware that the group functionality is a work in progress.

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

## GET `/interaction/:interactionId`

Get information about an interaction.
### Responses
#### 200
```json
{
  "type": "rocket",
  "fromUserId": 3,
  "toUserId": 5
}
```

#### 410 Interaction does not exist

## POST `/interaction`
Add new interaction.
### Request
```json
{
  "type": "rocket",
  "fromUserId": 3,
  "toUserId": 5
}
```
### Responses
#### 201 Interaction added

## PUT `/interaction/:interactionId`
Update interaction information
### Request
```json
{
  "radius": 4
}
```
### Responses
#### 200 Interaction updated
#### 410 Interaction does not exist

## DELETE `/interaction/:interactionId`
Delete an interaction and remove information related to the interaction.
### Responses
#### 200 Interaction deleted
#### 410 Interaction does not exist

## GET `/meeting` (not implemented)
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