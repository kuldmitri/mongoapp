var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;

var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://localhost:27017/usersdb";

app.use(express.static(__dirname + "/public"));
app.get("/api/books", function(req, res){

    mongoClient.connect(url, function(err, db){
        db.collection("books").find({}).toArray(function(err, books){
            res.send(books)
            db.close();
        });
    });
});
app.get("/api/users/:id", function(req, res){

    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("users").findOne({_id: id}, function(err, user){

            if(err) return res.status(400).send();

            res.send(user);
            db.close();
        });
    });
});

app.post("/api/books/", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);
    var book ={};
    var date = new Date();
    console.log(req.body);
    book.author = req.body.author;
    book.name = req.body.name;
    book.isuedto = req.body.abonent;
    book.isued = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

    mongoClient.connect(url, function(err, db){
        db.collection("books").insertOne(book, function(err, result){
            if(err) return res.status(400).send();
            res.send(book);
            db.close();
        });
    });
});

app.delete("/api/books/:id", function(req, res){

    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("books").findOneAndDelete({_id: id}, function(err, result){

            if(err) return res.status(400).send();

            var book = result.value;
            res.send(book);
            db.close();
        });
    });
});

app.put("/api/books", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var bookName = req.body.name;
    var bookAuthor = req.body.author;

    mongoClient.connect(url, function(err, db){
        db.collection("users").findOneAndUpdate({_id: id}, { $set: {author: bookAuthor, name: bookName}},
            {returnOriginal: false },function(err, result){

                if(err) return res.status(400).send();

                var user = result.value;
                res.send(user);
                db.close();
            });
    });
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});