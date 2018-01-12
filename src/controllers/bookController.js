const router = require('express').Router();
const book = require('../models/bookModel.js');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.get("/all", jsonParser, (req, res, next) => {
    book.all((err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post("/issue", jsonParser, (req, res, next) => {
    book.issue(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});

router.post("/return", jsonParser, (req, res, next) => {
    book.return(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});


router.post("/delete", jsonParser, (req, res, next) => {
    book.delete(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});

router.post("/find", jsonParser, (req, res, next) => {
    book.find(req.body, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post("/add", jsonParser, (req, res, next) => {
    book.add(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({book: doc});
    })
});

module.exports = router;