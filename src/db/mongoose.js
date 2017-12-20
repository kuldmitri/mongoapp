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

var Schema = mongoose.Schema;

// Schemas
var User = new Schema({
    number: {type: String, required: true},
    name: {type: String, required: true},
    mail: {type: String, required: true},
});

var Book = new Schema({
    name: {type: String, required: true},
    author: {type: String, required: true},
    issuedto: {type: Schema.ObjectId},
    issued: {type: String}
});

var UserModel = mongoose.model('User', User);
var BookModel = mongoose.model('Book', Book);

module.exports.UserModel = UserModel;
module.exports.BookModel = BookModel;