const _ = require('lodash');
const logger = require('../libs/logger')(module);
const BookModel = require('../db/bookShema').BookModel;
const UserModel = require('../db/userShema').UserModel;

exports.get = function (req, res, next) {
    BookModel.find(function (err, books) {
       if (err) return next(err);
       res.send(books);
    });
};

exports.issue = function (req, res, next) {
    const id = _.get(req, 'body.id');
    const number = _.get(req, 'body.number');
    if (!id || !number) return next(new Error('Invalid request data'));

    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    UserModel.findOne({number}, function (err, result) {
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
    if (!req.body.id) return next (new Error('Invalid request data'));
    var id = req.body.id;
    BookModel.findByIdAndUpdate(id, {issued: null, issuedto: null}, function (err, result) {
        if (err) return next(err);
        var book = result.value;
        res.send(book);
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
    if (!req.body.name || !req.body.author) return next(new Error('Invalid request data'));

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
    if (!req.body.id) return next(new Error('Invalid request data'));
    BookModel.findByIdAndRemove(req.body.id, function (err, result) {
        if (err) return next(err);
        res.send(result.value);
    });
};