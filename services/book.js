var ObjectId = require("mongodb").ObjectID;
var _ = require('lodash');
var logger = require('../libs/logger')(module);
var BookModel = require('../db/mongoose').BookModel;
var UserModel = require('../db/mongoose').UserModel;

exports.getBooks = function (req, res) {
    return BookModel.find(function (err, books) {
        if (err) return getServerError(err, res);
        //return res.render('books.hbs', {books});
        return res.send(books);
    });
};

exports.issueBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new ObjectId(req.body.id);
    var idAbonent;
    var number = req.body.number;
    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    UserModel.findOne({number: number}, function (err, result) {
        if (!result) {
            res.send('Not found');
        } else {
            idAbonent = new ObjectId(result._id);
            BookModel.findByIdAndUpdate(id, {issued: date, issuedto: idAbonent}, function (err, result) {
                if (err) return res.status(400).send();
                var book = result.value;
                console.log(book);
                res.send(book);
            });
        }
    });
};

exports.returnBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new ObjectId(req.body.id);
    BookModel.findByIdAndUpdate(id, {issued: null, issuedto: null}, function (err, result) {
        if (err) return getServerError(err, res);
        var book = result.value;
        res.send(book);
    });
};

exports.findBooks = function (req, res) {
    var query = {
        name: new RegExp(req.body.name, "i"),
        author: new RegExp(req.body.author, "i")
    };
    return BookModel.find(query, function (err, books) {
        if (err) return getServerError(err, res);
        return res.render('books.hbs', {books});
    });
};

exports.addBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    var book = new BookModel({
        author: req.body.author,
        name: req.body.name,
        issuedto: null,
        issued: req.body.issued
    });
    book.save(function (err) {
        if (err) return getServerError(err, res);
        logger.debug("Book created", {book});
        return res.send({status: 'OK', book});
    });
};

exports.deleteBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new ObjectId(req.body.id);
    BookModel.findOneAndRemove(id, function (err, result) {
        if (err) return res.status(400).send();
        var book = result.value;
        res.send(book);
    });
};

function getServerError(err, res) {
    res.statusCode = 500;
    logger.error('Internal error(%d): %s', res.statusCode, err.message);
    return res.send({error: 'Server error'});
}