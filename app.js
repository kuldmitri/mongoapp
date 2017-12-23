require('dotenv').config();
console.log('process.env.port = ' + process.env.port);
console.log('process.env.urlMongodb = ' + process.env.urlMongodb);

var express = require("express");

var app = express();
var logger = require('./src/libs/logger')(module);

app.use('/books', require('./src/controllers/bookController'));
app.use('/users', require('./src/controllers/userController'));

app.use(express.static(__dirname + "/public"));

app.listen(process.env.port, function () {
    logger.info('Listening on port ' + process.env.port);
});
module.exports = app; // for testing