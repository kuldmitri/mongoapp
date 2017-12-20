var router = require('express').Router();
var book = require('../services/book.srv.js');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.get("/", book.getBooks);
router.post("/issue", jsonParser, book.issueBook);
router.post("/return", jsonParser, book.returnBook);
router.post("/find", jsonParser, book.findBooks);
router.post("/add", jsonParser, book.addBook);
router.post("/delete", jsonParser, book.deleteBook);

module.exports = router;