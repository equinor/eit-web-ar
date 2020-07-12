var express = require('express');
var router = express.Router();
var path = require('path');

/* GET root page. */
router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = router;
