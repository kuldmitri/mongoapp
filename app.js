var express = require("express");

var app = express();
var logger = require('./src/libs/logger')(module);
var config = require('config');

console.log(config);

app.use('/books', require('./src/controllers/books'));
app.use('/users', require('./src/controllers/user'));

app.use(express.static(__dirname + "/public"));

app.listen(config.port, function () {
    logger.info('Listening on port 3000...');
});
module.exports = app; // для тестирования