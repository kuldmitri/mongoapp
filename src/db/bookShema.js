const mongoose = require('./mongoose');
const logger = require('../libs/logger')(module);
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    name: {type: String, required: true},
    author: {type: String, required: true},
    issuedto: {type: Schema.ObjectId},
    issued: {type: String}
});

BookSchema.statics.findByNameAndAuthor = function (name, authorName, cb) {
    const query = {
        name: new RegExp(name, "i"),
        author: new RegExp(authorName, "i")
    };
    return this.find(query, cb);
};

BookSchema.statics.addNewBook = function (obj, cb) {
    return this.create(obj, (err, doc) => {
        cb(err, doc);
    });
};

BookSchema.statics.deleteBook = function (obj, cb) {
    return this.findByIdAndRemove(obj.id, (err, doc) => {
        cb(err, doc);
    });
};

BookSchema.statics.returnBook = function (obj, cb) {
    return this.findByIdAndUpdate(obj.id, {issued: null, issuedto: null}, {new: true}, (err, doc) => {
        cb(err, doc);
    });
};

BookSchema.statics.findAll = function (cb) {
    return this.find((err, doc) => {
        cb(err, doc);
    });
};

const BookModel = mongoose.model('Book', BookSchema);

module.exports.BookModel = BookModel;