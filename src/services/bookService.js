const _ = require('lodash');
const logger = require('../libs/logger')(module);
const BookModel = require('../db/bookShema').BookModel;
const UserModel = require('../db/userShema').UserModel;
const httpErrors = require('../utils/httpErrors');

exports.findAll = (cb) => {
    BookModel.find({}, cb);
};

exports.issueBook = (obj, cb) => {
    const id = _.get(obj, 'id');
    const number = _.get(obj, 'number');
    if (!id || !number) return cb(httpErrors.createBadRequestError(), null);

    let date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    UserModel.findOne({number: number}, (err, doc) => {
        if (err) return cb(err, null);
        if (!doc) return cb(httpErrors.createNotFoundNumberError(number), null);
        BookModel.findByIdAndUpdate(id, {issued: date, issuedto: doc._id}, {new: true}, (err, book) => {
            cb(err, book);
        });
    });
};

exports.returnBook = (obj, cb) => {
    BookModel.findByIdAndUpdate(obj.id, {issued: null, issuedto: null}, {new: true}, cb);
};

exports.findByNameAndAuthor = (obj, cb) => {
    const query = {
        name: new RegExp(obj.name, "i"),
        author: new RegExp(obj.author, "i")
    };
    BookModel.find(query, cb);
};

exports.addNewBook = (obj, cb) => {
    BookModel.create(obj, cb);
};

exports.deleteBook = (obj, cb) => {
    BookModel.findByIdAndRemove(obj.id, cb);
};
