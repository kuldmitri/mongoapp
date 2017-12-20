var mongoose = require('mongoose');
var logger = require('../libs/logger')(module);
var config = require('config');

mongoose.connect(config.urlMongodb);
var db = mongoose.connection;

db.on('error', function (err) {
    logger.error('connection error:', err.message);
});
db.once('open', function callback() {
    logger.info("Connected to DB!");
});

module.exports = mongoose;