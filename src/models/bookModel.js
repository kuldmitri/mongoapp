var logger = require('../libs/logger')(module);
var BookModel = require('../db/bookShema').BookModel;
var UserModel = require('../db/userShema').UserModel;

exports.get = function (req, res) {
    return BookModel.find(function (err, books) {
        if (err) return getServerError(err, res);
        return res.send(books);
    });
};

exports.issue = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = req.body.id;
    var idAbonent;
    var number = req.body.number;
    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    UserModel.findOne({number: number}, function (err, result) {
        if (!result) {
            res.send('Not found');
        } else {
            idAbonent = result._id;
            BookModel.findByIdAndUpdate(id, {issued: date, issuedto: idAbonent}, {new: true}, function (err, book) {
                if (err) return res.status(400).send();
                res.send({status: 'OK', book});
            });
        }
    });
};

exports.return = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = req.body.id;
    BookModel.findByIdAndUpdate(id, {issued: null, issuedto: null}, function (err, result) {
        if (err) return getServerError(err, res);
        var book = result.value;
        res.send(book);
    });
};

exports.find = function (req, res) {
    var query = {
        name: new RegExp(req.body.name, "i"),
        author: new RegExp(req.body.author, "i")
    };
    return BookModel.find(query, function (err, books) {
        if (err) return getServerError(err, res);
        return res.send(books);
    });
};

exports.add = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    var book = new BookModel({
        author: req.body.author,
        name: req.body.name,
        issuedto: null,
        issued: req.body.issued
    });
    book.save(function (err) {
        if (err) {
            return getServerError(err, res);
            console.log('Error book.save');
        }
        logger.debug("Book created", {book});
        return res.send({status: 'OK', book});
    });
};

exports.delete = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = req.body.id;
    BookModel.findByIdAndRemove(id, function (err, result) {
        if (err) return res.status(400).send();
        var book = result.value;
        res.send(book);
    });
};

function getServerError(err, res) {
    res.statusCode = 500;
    logger.error('Internal error(%d): %s', res.statusCode, err.message);
    return res.send(err);
}