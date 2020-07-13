const redis = require('redis');

const storage = redis.createClient({
  host: 'storage',
  auth_pass: process.env.REDIS_PASSWORD
});

storage.on('error', function (error) {
  console.log(error);
});

// Do you really want to flush the storage _every_ time you restart the node app? :)
// It will require more effort to work with as you then have to manually add data before you can use the app.
// ...Unless you also preload it with default data on every restart, or even additional debug data. Have a think about it.
//storage.flushall();

module.exports = storage;