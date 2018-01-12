const _ = require('lodash');
const logger = require('../libs/logger')(module);
const BookModel = require('../db/bookShema').BookModel;
const UserModel = require('../db/userShema').UserModel;
const httpErrors = require('../utils/httpErrors');

exports.all = (cb) => {
    BookModel.find((err, doc) => {

        cb(err, doc);
    });
};

exports.issue = (obj, cb) => {
    const id = _.get(obj, 'id');
    const number = _.get(obj, 'number');
    if (!id || !number) return cb(httpErrors.createBadRequestError(), null);

    let date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    UserModel.findOne({number: number}, (err, doc) => {
        if (err) return cb(err, null);
        if (!doc) return cb(httpErrors.createNotFoundNumberError(number), null);
        BookModel.findByIdAndUpdate(id, {issued: date, issuedto: doc._id}, {new: true}, (err, doc) => {
            cb(err, doc);
        });
    });
};

exports.return = (obj, cb) => {
    if (!obj.id) return cb(httpErrors.createBadRequestError(), null);
    BookModel.findByIdAndUpdate(obj.id, {issued: null, issuedto: null}, {new: true}, (err, doc) => {
        cb(err, doc);
    });
};

exports.find = (obj, cb) => {
    const query = {
        name: new RegExp(obj.name, "i"),
        author: new RegExp(obj.author, "i")
    };
    BookModel.find(query, (err, doc) => {
        cb(err, doc);
    });
};

exports.add = (obj, cb) => {
    if (!obj.name || !obj.author) return cb(httpErrors.createBadRequestError(), null);
    BookModel.create(obj, (err, doc) => {
        console.log(doc);
        cb(err, doc);
    });
};

exports.delete = (obj, cb) => {
    if (!obj.id) return cb(httpErrors.createBadRequestError(), null);
    BookModel.findByIdAndRemove(obj.id, (err, doc) => {
        console.log(doc);
        cb(err, doc);
    });
};