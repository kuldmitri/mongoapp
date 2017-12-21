var router = require('express').Router();
var book = require('../models/book.js');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.get("/", book.get);
router.post("/issue", jsonParser, book.issue);
router.post("/return", jsonParser, book.return);
router.post("/find", jsonParser, book.find);
router.post("/add", jsonParser, book.add);
router.post("/delete", jsonParser, book.delete);

module.exports = router;