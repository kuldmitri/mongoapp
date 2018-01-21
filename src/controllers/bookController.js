const router = require('express').Router();
const bookService = require('../services/bookService');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.get("/all", jsonParser, (req, res, next) => {
    bookService.findAll((err, books) => {
        if (err) return next(err);
        res.send(books);
    })
});

router.post("/issue", jsonParser, (req, res, next) => {
    bookService.issueBook(req.body, (err, book) => {
        if (err) return next(err);
        res.send({book});
    })
});

router.post("/return", jsonParser, (req, res, next) => {
    bookService.returnBook(req.body, (err, book) => {
        if (err) return next(err);
        res.send({book});
    })
});


router.post("/delete", jsonParser, (req, res, next) => {
    bookService.deleteBook(req.body, (err, book) => {
        if (err) return next(err);
        res.send({book});
    })
});

router.post("/find", jsonParser, (req, res, next) => {
    bookService.findByNameAndAuthor(req.body, (err, books) => {
        if (err) return next(err);
        res.send(books);
    })
});

router.post("/add", jsonParser, (req, res, next) => {
    bookService.addNewBook(req.body, (err, book) => {
        if (err) return next(err);
        res.send({book});
    })
});

module.exports = router;