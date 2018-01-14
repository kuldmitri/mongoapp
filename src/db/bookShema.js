const mongoose = require('./mongoose');
const logger = require('../libs/logger')(module);
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    name: {type: String, required: true},
    author: {type: String, required: true},
    issuedto: {type: Schema.ObjectId},
    issued: {type: String}
});

BookSchema.statics.findByNameAndAuthor = function(name, authorName, cb) {
    const query = {
        name: new RegExp(name, "i"),
        author: new RegExp(authorName, "i")
    };
    return this.find(query, cb);
};

const BookModel = mongoose.model('Book', BookSchema);

module.exports.BookModel = BookModel;