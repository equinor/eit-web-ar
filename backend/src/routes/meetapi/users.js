var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');
var utils = require('../../modules/utils');
var meeting = require('../../modules/meeting');

router.get('/', (req, res) => {  // Get position of all users
  storage.smembers('users', (err, users) => {
    let multi = [];
    for (let i = 0; i < users.length; i++) {
      let userHash = utils.getUserHash(users[i]);
      multi.push(['hgetall', userHash]);
    }
    storage.multi(multi).exec((err, userInfo) => {
      for (let i = 0; i < users.length; i++) {
        userInfo[i].userId = users[i];
      }
      console.log(userInfo);
      res.status(200).send(userInfo);
    });
  });
});

module.exports = router;