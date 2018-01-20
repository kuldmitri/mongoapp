require('dotenv').config();
console.log('process.env.port = ' + process.env.port);
console.log('process.env.urlMongodb = ' + process.env.urlMongodb);
console.log('process.env.pathBookCSVdb = ' + process.env.pathBookCSVdb);
const fs = require("fs");


const express = require("express");

const app = express();
const logger = require('./src/libs/logger')(module);

if (!fs.existsSync(process.env.pathBookCSVdb)){
    fs.appendFileSync(process.env.pathBookCSVdb, '');
}

app.use('/books', require('./src/controllers/bookController'));
app.use('/users', require('./src/controllers/userController'));

app.use(express.static(__dirname + "/public"));

app.listen(process.env.port, () => {
    logger.info('Listening on port ' + process.env.port);
});

app.use((err, req, res, next) => {
    logger.error(err);
    switch (err.name) {
        case 'MongoError':
            res.status(422);
            if (err.message.match('E11000 duplicate key error collection') && err.message.indexOf('number') > 0) {
                res.send('Данный номер читательского билета уже зарегистрирован ');
            } else {
                res.send(err.message);
            }
            break;
        case 'ValidationError':
            res.status(422);
            res.send(err.message);
            break;
        default:
            if (!err.status) {
                res.status(500);
                res.send('Houston, we have a problem');
            } else {
                res.status(err.status);
                res.send(err.message);
            }
            break;
    }
});

app.use((req, res) => {
    res.status(404);
    res.send('Page not found');
});

module.exports = app; // for testing