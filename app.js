var express = require("express");
var bodyParser = require("body-parser");
var book = require('./src/services/book.js');
var user = require('./src/services/user.js');
var app = express();
var logger = require('./src/libs/logger')(module);
var config = require('config');

console.log(config);

app.set("view engine", "hbs");
var jsonParser = bodyParser.json();

//app.use('/books', require('./controllers/books'));
//app.use('/users', require('./controllers/users'));
app.use('/example', require('./src/controllers/example'));

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

app.listen(config.port, function () {
    logger.info('Listening on port 3000...');
});
module.exports = app; // для тестирования