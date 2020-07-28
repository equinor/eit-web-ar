var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');
var utils = require('../../modules/utils');
var meeting = require('../../modules/meeting');

router.get('/', (req, res) => {
  res.status(200).send({ description: "meeting/rocket api"});
});

router.get('/:rocketId', (req, res) => {
  const rocketId = req.params.rocketId;
  hash = utils.getRocketHash(rocketId);
  storage.hgetall(hash, (err, rocketInfo) => {
    if (rocketInfo === null) {
      res.status(410).send();
      return;
    }
    res.status(200).send(rocketInfo);
  });
});

router.put('/:rocketId', (req, res) => {
  const rocketId = req.params.rocketId;
  storage.sismember('rockets', rocketId, (err, rocketExists) => {
    if (!rocketExists) {
      res.status(410).send();
      return;
    }
    const args = utils.objectToStorageArray(req.body);
    const hash = utils.getRocketHash(rocketId);
    storage.hmset(hash, args);
      
    res.status(200).send();
  });
});

router.post('/', (req, res) => {
  const io = req.app.get('io');
  storage.incr('lastRocketId', (err, newRocketId) => {
    storage.sadd('rockets', newRocketId);
    const args = utils.objectToStorageArray(req.body);
    const hash = utils.getRocketHash(newRocketId);
    storage.hmset(hash, args);
    storage.hgetall(hash, (err, rocketInfo) => {
      rocketInfo.rocketId = newRocketId;
      res.status(201).send(rocketInfo);
    });
    emitRocketJoined(io, newRocketId);
  });
});

router.delete('/:rocketId', (req, res) => {
  const rocketId = req.params.rocketId;
  storage.sismember('rockets', rocketId, (err, rocketExists) => {
    if (!rocketExists) {
      res.status(410).send();
      return;
    }
    storage.srem('rockets', rocketId);
    const rocketHash = utils.getRocketHash(rocketId);
    storage.del(rocketHash);
    meeting.emitRocketLeft(rocketId);
    
    res.status(200).send();
  });
});

module.exports = router;

function emitRocketJoined(io, rocketId) {
  const rocketHash = utils.getRocketHash(rocketId);
  storage.hgetall(rocketHash, (err, rocketInfo) => {
    rocketInfo.rocketId = rocketId;
    io.emit('rocket-joined', rocketInfo);
  });
}