const _ = require('lodash');
const logger = require('../libs/logger')(module);
const BookModel = require('../db/bookShema').BookModel;
const UserModel = require('../db/userShema').UserModel;
const httpErrors = require('../utils/httpErrors');

exports.get = function (req, res, next) {
    BookModel.find(function (err, books) {
        if (err) return next(err);
        return res.send(books);
    });
};

exports.issue = function (req, res, next) {
    const id = _.get(req, 'body.id');
    const number = _.get(req, 'body.number');
    if (!id || !number) return next(httpErrors.createBadRequestError());

    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    UserModel.findOne({number: number}, function (err, result) {
        if (err) return next(err);
        if (!result) {
            return res.send('Not found');
        }
        BookModel.findByIdAndUpdate(id, {issued: date, issuedto: result._id}, {new: true}, function (err, book) {
            if (err) return next(err);
            res.send({book});
        });
    });
};

exports.return = function (req, res, next) {
    if (!req.body.id) return next(httpErrors.createBadRequestError());
    BookModel.findByIdAndUpdate(req.body.id, {issued: null, issuedto: null}, {new: true}, function (err, result) {
        if (err) return next(err);
        res.send({book: result._doc});
    });
};

exports.find = function (req, res, next) {
    var query = {
        name: new RegExp(req.body.name, "i"),
        author: new RegExp(req.body.author, "i")
    };
    BookModel.find(query, function (err, books) {
        if (err) return next(err);
        res.send(books);
    });
};

exports.add = function (req, res, next) {
    if (!req.body.name || !req.body.author) return next(httpErrors.createBadRequestError());
    var book = new BookModel({
        author: req.body.author,
        name: req.body.name,
        issuedto: null,
        issued: req.body.issued
    });
    book.save(function (err) {
        if (err) return next(err);
        res.send({book});
    });
};

exports.delete = function (req, res, next) {
    if (!req.body.id) return next(httpErrors.createBadRequestError());
    BookModel.findByIdAndRemove(req.body.id, function (err, result) {
        if (err) return next(err);
        res.send(result.value);
    });
};