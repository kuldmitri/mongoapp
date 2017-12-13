var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;

exports.getBooks = function (req, res) {
    mongoClient.connect(process.env.urlMongodb, function (err, db) {
        db.collection("book").find({}).toArray(function (err, books) {
            res.send(books);
            db.close();
        });
    });
};

exports.issueBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var idAbonent;
    var number = req.body.number;
    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    mongoClient.connect(process.env.urlMongodb, function (err, db) {
        db.collection("user").findOne({number: number}, function (err, result) {
            if (!result) {
                res.send(null);
                db.close();
            } else {
                idAbonent = new objectId(result._id);
                db.collection("book").findOneAndUpdate({_id: id}, {
                        $set: {
                            issued: date,
                            issuedto: idAbonent
                        }
                    },
                    {returnOriginal: false}, function (err, result) {
                        if (err) return res.status(400).send();
                        var book = result.value;
                        res.send(book);
                        db.close();
                    });
            }
        });
    });
};

exports.returnBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    mongoClient.connect(process.env.urlMongodb, function (err, db) {
        db.collection("book").findOneAndUpdate({_id: id}, {$set: {issued: null, issuedto: null}},
            {returnOriginal: false}, function (err, result) {
                if (err) return res.status(400).send();
                var book = result.value;
                res.send(book);
                db.close();
            });
    });
};

exports.findBooks = function (req, res) {
    var name = req.body.name;

    var author = req.body.author;

    mongoClient.connect(process.env.urlMongodb, function (err, db) {
        db.collection("book").find({
            name: new RegExp(name, "i"),
            author: new RegExp(author, "i")
        }).toArray(function (err, books) {
            res.send(books);
            db.close();
        });
    });
};

exports.addBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var book = {};
    book.author = req.body.author;
    book.name = req.body.name;
    book.issuedto = req.body.abonent;
    book.issued = req.body.issued;
    mongoClient.connect(process.env.urlMongodb, function (err, db) {
        db.collection("book").insertOne(book, function (err, result) {
            if (err) return res.status(400).send();
            res.send(result.value);
            db.close();
        });
    });
};

exports.deleteBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    mongoClient.connect(process.env.urlMongodb, function (err, db) {
        db.collection("book").findOneAndDelete({_id: id}, function (err, result) {
            if (err) return res.status(400).send();
            var book = result.value;
            res.send(book);
            db.close();
        });
    });
};