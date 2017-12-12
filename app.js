var express = require("express");
var bodyParser = require("body-parser");
var book = require('./services/book.js');

var app = express();
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));
app.get("/api/books", book.getBooks);
app.post("/api/issueBook", jsonParser, book.issueBook);
app.post("/api/returnBook", jsonParser, book.returnBook);
app.post("/api/findBooks", jsonParser, book.findBooks);
app.post("/api/addBook", jsonParser, book.addBook);
app.post("/api/deleteBook", jsonParser, book.deleteBook);

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});