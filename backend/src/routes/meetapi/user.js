var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');
var utils = require('../../modules/utils');

router.get('/', (req, res) => {
  res.status(200).send({ description: "meeting/user api"});
});

router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  hash = utils.getUserHash(userId);
  storage.hgetall(hash, (err, userInfo) => {
    if (userInfo === null) {
      res.status(410).send();
      return;
    }
    res.status(200).send(userInfo);
  });
});

router.put('/:userId', (req, res) => {
  const userId = req.params.userId;
  storage.sismember('users', userId, (err, userExists) => {
    if (!userExists) {
      res.status(410).send();
      return;
    }
    const args = utils.objectToStorageArray(req.body);
    const hash = utils.getUserHash(userId);
    storage.hmset(hash, args);
    
    // Handle group change
      
    res.status(200).send();
  });
});

router.post('/', (req, res) => {
  storage.incr('lastUserId', (err, newUserId) => {
    storage.sadd('users', newUserId);
    const args = utils.objectToStorageArray(req.body);
    const hash = utils.getUserHash(newUserId);
    storage.hmset(hash, args);
    
    const io = req.app.get('io');
    emitUserJoined(io, newUserId);
    
    // Add user to a group
    
    res.status(201).send({ "userId": newUserId });
  });
});

router.delete('/:userId', (req, res) => {
  const userId = req.params.userId;
  storage.sismember('users', userId, (err, userExists) => {
    if (!userExists) {
      res.status(410).send();
      return;
    }
    storage.srem('users', userId);
    const userHash = utils.getUserHash(userId);
    storage.del(userHash);
    
    // Remove user from group
    
    res.status(200).send();
  });
});

module.exports = router;

function emitUserJoined(io, userId) {
  const userHash = utils.getUserHash(userId);
  storage.hget(userHash, 'name', (err, name) => {
    io.emit('user-joined', {
      userId: userId,
      name: name
    });
  });
}