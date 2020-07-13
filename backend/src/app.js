var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// origin=null is dirty workaround for running XMLHttpRequest in chrome dev tools
var corsOptions = {
    origin: ['null','http://localhost', 'http://frontend'],
    methods: ['GET', 'PUT', 'POST'],
    optionsSuccessStatus: 200
  };


var app = express();
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/** ROUTES */
var indexRouter = require('./routes/index');
var playerRouter = require('./routes/api/player');
var entityRouter = require('./routes/api/entity');
var entitiesRouter = require('./routes/api/entities');
var gameRouter = require('./routes/api/game');

app.use('/', indexRouter);
app.use('/api/player', playerRouter);
app.use('/api/entity', entityRouter);
app.use('/api/entities', entitiesRouter);
app.use('/api/game', gameRouter);


module.exports = app;
