var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// origin=null is dirty workaround for running XMLHttpRequest in chrome dev tools
var corsOptions = {
    origin: ['null','http://localhost', 'http://frontend', 'https://localhost:3000', 'https://entrypoint-eit-web-ar-development.playground.radix.equinor.com', 'https://eit-web-ar.app.playground.radix.equinor.com'],
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
app.use('/', indexRouter);

// The Game
var playerRouter = require('./routes/api/player');
var entityRouter = require('./routes/api/entity');
var entitiesRouter = require('./routes/api/entities');
var gameRouter = require('./routes/api/game');

app.use('/api/player', playerRouter);
app.use('/api/entity', entityRouter);
app.use('/api/entities', entitiesRouter);
app.use('/api/game', gameRouter);

// The Meeting
var usersRouter = require('./routes/meetapi/users');
var userRouter = require('./routes/meetapi/user');
var groupRouter = require('./routes/meetapi/group');
var meetingRouter = require('./routes/meetapi/meeting');
var interactionRouter = require('./routes/meetapi/interaction');

app.use('/meetapi/users', usersRouter);
app.use('/meetapi/user', userRouter);
app.use('/meetapi/group', groupRouter);
app.use('/meetapi/meeting', meetingRouter);
app.use('/meetapi/interaction', interactionRouter);


module.exports = app;
