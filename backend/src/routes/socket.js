var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function (req, res) {
  // ws
  var io = req.app.get('socketio');
  console.log(io);
  
  io.on('connection', (socket) => {
    console.log('io connection');
    io.emit('heisann sveisann');
  });
  
  
  
  let defaultData = {
    description: "socket :)"
  };
  res.status(209).json(defaultData);
});

module.exports = router;
