const router = require('express').Router();
const bookService = require('../services/bookService.js');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.get("/all", jsonParser, (req, res, next) => {
    bookService.all((err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post("/issue", jsonParser, (req, res, next) => {
    bookService.issue(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});

router.post("/return", jsonParser, (req, res, next) => {
    bookService.return(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});


router.post("/delete", jsonParser, (req, res, next) => {
    bookService.delete(req.body, (err, doc) => {
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
    bookService.add(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});

module.exports = router;