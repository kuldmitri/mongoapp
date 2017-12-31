require('dotenv').config();
console.log('process.env.port = ' + process.env.port);
console.log('process.env.urlMongodb = ' + process.env.urlMongodb);

var express = require("express");

var app = express();
var logger = require('./src/libs/logger')(module);

app.use('/books', require('./src/controllers/bookController'));
app.use('/users', require('./src/controllers/userController'));

app.use(express.static(__dirname + "/public"));

app.listen(process.env.port, () => {
    logger.info('Listening on port ' + process.env.port);
});

app.use((err, req, res, next) => {
    logger.error({error: err.stack});
    if (err.message === 'Invalid request data') {
        res.status(400);
        res.send('Invalid request data');
    } else {
        res.status(500);
        res.send('Houston, we have a problem');
    }
});

app.use((req, res) => {
    res.status(404);
    res.send('Page not found');
});

module.exports = app; // for testing