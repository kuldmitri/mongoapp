var objectId = require("mongodb").ObjectID;
var db = require('../db/db.js');

exports.getBooks = function (req, res) {
    db.get().collection('book').find({}).toArray(function (err, books) {
        res.render('books.hbs', {books: books});
    });
};

exports.issueBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var idAbonent;
    var number = req.body.number;
    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();


    db.get().collection("user").findOne({number: number}, function (err, result) {
        if (!result) {
            res.send(null);
        } else {
            idAbonent = new objectId(result._id);
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
    var id = new objectId(req.body.id);
    db.get().collection("book").findOneAndUpdate({_id: id}, {$set: {issued: null, issuedto: null}},
        {returnOriginal: false}, function (err, result) {
            if (err) return res.status(400).send();
            var book = result.value;
            res.send(book);
        });
};

exports.findBooks = function (req, res) {
    var name = req.body.name;
    var author = req.body.author;
    db.get().collection("book").find({
        name: new RegExp(name, "i"),
        author: new RegExp(author, "i")
    }).toArray(function (err, books) {
        res.render('books.hbs', {books: books});
        console.log(books);
    });
};

exports.addBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var book = {};
    book.author = req.body.author;
    book.name = req.body.name;
    book.issuedto = req.body.abonent;
    book.issued = req.body.issued;
    db.get().collection("book").insertOne(book, function (err, result) {
        if (err) return res.status(400).send();
        res.send(result.value);
    });
};

exports.deleteBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    db.get().collection("book").findOneAndDelete({_id: id}, function (err, result) {
        if (err) return res.status(400).send();
        var book = result.value;
        res.send(book);
    });
};