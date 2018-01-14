const router = require('express').Router();
const userService = require('../services/userService.js');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.get("/all", jsonParser, (req, res, next) => {
    userService.findAll((err, doc) => {
        if (err) return next(err);
        res.send(doc);
    });
});

router.post("/add", jsonParser, (req, res, next) => {
    userService.addUser(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({user: doc});
    });
});

router.post("/delete", jsonParser, (req, res, next) => {
    userService.deleteUser(req.body, (err, doc) => {
        if (err) return next(err);
        res.send({user: doc});
    });
});

router.post("/find", jsonParser, (req, res, next) => {
    userService.findUser(req.body, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
    });
});

module.exports = router;