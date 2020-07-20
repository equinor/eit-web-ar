var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');

router.get('/', (req, res) => {
  // Return information about everything
  res.status(200).send("Not implemented yet");
});

router.put('/reset', (req, res) => {
  storage.flushall();
  res.status(200).send("Redis is now flushed");
});

module.exports = router;