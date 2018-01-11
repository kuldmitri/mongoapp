const router = require('express').Router();
const user = require('../models/userModel.js');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.get("/all", jsonParser, (req, res, next) => {
    user.all((err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post("/add", jsonParser, (req, res, next) => {
    user.add(req.body, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post("/delete", jsonParser, (req, res, next) => {
    user.delete(req.body, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post("/find", jsonParser, (req, res, next) => {
    user.find(req.body, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

module.exports = router;