# The Meeting API

## GET `/user/:userId`
Get all available information about a user.

### Responses
#### 200 OK
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
#### 200 OK
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

## GET `/group/:groupId`
Get information about a group and the players within the group
### Responses
#### 200 OK
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

## PUT `/group/:groupId`
Update group information
### Request
```json
{
  "radius": 4
}
```
### Responses
#### 200 OK
#### 410 Group does not exist

## GET `/meeting`
Get all available information about everything
### Responses
#### 200 OK
```json
{
  "...": "?"
}
```

## GET `/meeting/reset`
Flush Redis.
### Responses
#### 200 OK