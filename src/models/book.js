var mongoose = require('../db/mongoose');
var logger = require('../libs/logger')(module);
var Schema = mongoose.Schema;

var Book = new Schema({
    name: {type: String, required: true},
    author: {type: String, required: true},
    issuedto: {type: Schema.ObjectId},
    issued: {type: String}
});

var BookModel = mongoose.model('Book', Book);

module.exports.BookModel = BookModel;