var express = require("express");
var bodyParser = require("body-parser");
var book = require('./services/book.js');
var user = require('./services/user.js');
var mongoClient = require("mongodb").MongoClient;
var app = express();

app.set("view engine", "hbs");
var jsonParser = bodyParser.json();

process.env.urlMongodb = "mongodb://localhost:27017/Library";

mongoClient.connect(process.env.urlMongodb, function (err, database) {
    global.db = database;
    app.listen(3000);
    console.log("Сервер ожидает подключения...");
});

app.use(express.static(__dirname + "/public"));
app.get("/books", book.getBooks);
app.post("/issueBook", jsonParser, book.issueBook);
app.post("/returnBook", jsonParser, book.returnBook);
app.post("/findBooks", jsonParser, book.findBooks);
app.post("/addBook", jsonParser, book.addBook);
app.post("/deleteBook", jsonParser, book.deleteBook);

app.get("/users", user.getUsers);
app.post("/updateUser", jsonParser, user.updateUser);
app.post("/addUser", jsonParser, user.addUser);
app.post("/deleteUser", jsonParser, user.deleteUser);
app.post("/gerIdAbonent", jsonParser, user.gerIdAbonent);

app.get("/hbs", book.hbs);

