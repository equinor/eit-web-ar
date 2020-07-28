var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');
var utils = require('../../modules/utils');
var meeting = require('../../modules/meeting');

router.get('/', (req, res) => {
  res.status(200).send({ description: "meeting/interaction api"});
});

router.get('/:interactionId', (req, res) => {
  const interactionId = req.params.interactionId;
  hash = utils.getInteractionHash(interactionId);
  storage.hgetall(hash, (err, interactionInfo) => {
    if (interactionInfo === null) {
      res.status(410).send();
      return;
    }
    res.status(200).send(interactionInfo);
  });
});

router.put('/:interactionId', (req, res) => {
  const interactionId = req.params.interactionId;
  storage.sismember('interactions', interactionId, (err, interactionExists) => {
    if (!interactionExists) {
      res.status(410).send();
      return;
    }
    const args = utils.objectToStorageArray(req.body);
    const hash = utils.getInteractionHash(interactionId);
    storage.hmset(hash, args);
      
    res.status(200).send();
  });
});

router.post('/', (req, res) => {
  storage.incr('lastInteractionId', (err, newInteractionId) => {
    storage.sadd('interactions', newInteractionId);
    const args = utils.objectToStorageArray(req.body);
    const hash = utils.getInteractionHash(newInteractionId);
    storage.hmset(hash, args);
    storage.hgetall(hash, (err, interactionInfo) => {
      interactionInfo.interactionId = newInteractionId;
      res.status(201).send(interactionInfo);
    });
    meeting.emitInteractionJoined(newInteractionId, req.body);
  });
});

router.delete('/:interactionId', (req, res) => {
  const interactionId = req.params.interactionId;
  storage.sismember('interactions', interactionId, (err, interactionExists) => {
    if (!interactionExists) {
      res.status(410).send();
      return;
    }
    storage.srem('interactions', interactionId);
    const interactionHash = utils.getInteractionHash(interactionId);
    storage.del(interactionHash);
    meeting.emitInteractionLeft(interactionId);
    
    res.status(200).send();
  });
});

module.exports = router;