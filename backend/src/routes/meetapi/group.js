var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');
var utils = require('../../modules/utils');

router.get('/', (req, res) => {
  res.status(200).send({ description: "meeting/group api" });
});

router.get('/:groupId', (req, res) => {
  const groupId = req.params.groupId;
  hash = utils.getGroupHash(groupId);
  storage.hgetall(hash, (err, groupInfo) => {
    if (groupInfo === null) {
      res.status(410).send();
      return;
    }
    res.status(200).send(groupInfo);
  });
});

router.put('/:groupId', (req, res) => {
  const groupId = req.params.groupId;
  storage.sismember('groups', groupId, (err, groupExists) => {
    if (!groupExists) {
      res.status(410).send();
      return;
    }
    const args = utils.objectToStorageArray(req.body);
    const hash = utils.getGroupHash(groupId);
    storage.hmset(hash, args);
      
    res.status(200).send();
  });
});

router.post('/', (req, res) => {
  storage.incr('lastGroupId', (err, newGroupId) => {
    storage.sadd('groups', newGroupId);
    const args = utils.objectToStorageArray(req.body);
    const hash = utils.getGroupHash(newGroupId);
    storage.hmset(hash, args);
    
    res.status(201).send({ "groupId": newGroupId });
  });
});

router.delete('/:groupId', (req, res) => {
  const groupId = req.params.groupId;
  storage.sismember('groups', groupId, (err, groupExists) => {
    if (!groupExists) {
      res.status(410).send();
      return;
    }
    storage.srem('groups', groupId);
    const groupHash = utils.getGroupHash(groupId);
    storage.del(groupHash);
    
    res.status(200).send();
  });
});

module.exports = router;