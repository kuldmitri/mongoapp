var ObjectId = require("mongodb").ObjectID;
var _ = require('lodash');
var logger = require('../libs/logger')(module);
var BookModel = require('../db/mongoose').BookModel;

exports.getBooks = function (req, res) {
    return BookModel.find(function (err, books) {
        if (err) return getServerError(err, res);

        return res.render('books.hbs', {books});
    });
};

exports.issueBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new ObjectId(req.body.id);
    var idAbonent;
    var number = req.body.number;
    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();


    db.get().collection("user").findOne({number: number}, function (err, result) {
        if (!result) {
            res.send(null);
        } else {
            idAbonent = new ObjectId(result._id);
            db.get().collection("book").findOneAndUpdate({_id: id}, {
                    $set: {
                        issued: date,
                        issuedto: idAbonent
                    }
                },
                {returnOriginal: false}, function (err, result) {
                    if (err) return res.status(400).send();
                    var book = result.value;
                    res.send(book);
                });
        }
    });
};

exports.returnBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new ObjectId(req.body.id);
    db.get().collection("book").findOneAndUpdate({_id: id}, {$set: {issued: null, issuedto: null}},
        {returnOriginal: false}, function (err, result) {
            if (err) return res.status(400).send();
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
    db.get().collection("book").findOneAndDelete({_id: id}, function (err, result) {
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