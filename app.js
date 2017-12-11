var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;

var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://localhost:27017/Library";

app.use(express.static(__dirname + "/public"));
app.get("/api/books", function (req, res) {

    mongoClient.connect(url, function (err, db) {
        db.collection("book").find({}).toArray(function (err, books) {
            res.send(books);
            db.close();
        });
    });
});

app.post("/api/issueBook", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var abonent = req.body.abonent;
    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    mongoClient.connect(url, function (err, db) {
        db.collection("book").findOneAndUpdate({_id: id}, {$set: {issued: date, issuedto: abonent}},
            {returnOriginal: false}, function (err, result) {
                if (err) return res.status(400).send();
                var book = result.value;
                console.log(result);
                res.send(book);
                db.close();
            });
    });
});


app.post("/api/returnBook", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    mongoClient.connect(url, function (err, db) {
        db.collection("book").findOneAndUpdate({_id: id}, {$set: {issued: null, issuedto: null}},
            {returnOriginal: false}, function (err, result) {
                if (err) return res.status(400).send();
                var book = result.value;
                console.log(result);
                res.send(book);
                db.close();
            });
    });
});

app.post("/api/findBooks", jsonParser, function (req, res) {
    var name = req.body.name;
    var author = req.body.author;
    console.log('findBooks ' + name + ' ' + author);
    mongoClient.connect(url, function (err, db) {
        db.collection("book").find({name: name}).toArray(function (err, books) {
            res.send(books);
            console.log(books);
            db.close();
        });
    });
});

app.post("/api/books/", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    var book = {};
    var date = new Date();
    console.log(req.body);
    book.author = req.body.author;
    book.name = req.body.name;
    book.issuedto = req.body.abonent;
    book.issued = req.body.issued;

    mongoClient.connect(url, function (err, db) {
        db.collection("book").insertOne(book, function (err, result) {
            if (err) return res.status(400).send();
            res.send(book);
            db.close();
        });
    });
});

app.post("/api/deleteBook", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);

    mongoClient.connect(url, function (err, db) {
        db.collection("book").findOneAndDelete({_id: id}, function (err, result) {

            if (err) return res.status(400).send();

            var book = result.value;
            res.send(book);
            db.close();
        });
    });
});

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});