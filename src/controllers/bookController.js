const router = require('express').Router();
const bookService = require('../services/bookService.js');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.get("/all", jsonParser, (req, res, next) => {
    bookService.findAll((err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post("/issue", jsonParser, (req, res, next) => {
    bookService.issueBook(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});

router.post("/return", jsonParser, (req, res, next) => {
    bookService.returnBook(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});


router.post("/delete", jsonParser, (req, res, next) => {
    bookService.deleteBook(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});

router.post("/find", jsonParser, (req, res, next) => {
    bookService.findByNameAndAuthor(req.body, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post("/add", jsonParser, (req, res, next) => {
    bookService.addNewBook(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});

module.exports = router;