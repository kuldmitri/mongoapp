var objectId = require("mongodb").ObjectID;
var db = require('../db/db.js');

exports.getUsers = function (req, res) {
    db.get().collection("user").find({}).toArray(function (err, users) {
        res.render('user.hbs', {user: users});
    });
};


exports.addUser = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var user = {};
    user.number = req.body.number;
    user.name = req.body.name;
    user.mail = req.body.mail;
    db.get().collection("user").insertOne(user, function (err, result) {
        if (err) return res.status(400).send();
        res.send(result.value);
    });
};

exports.deleteUser = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    db.get().collection("user").findOneAndDelete({_id: id}, function (err, result) {
        if (err) return res.status(400).send();
        var user = result.value;
        res.send(user);
    });
};

exports.updateUser = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var user = {};
    user.number = req.body.author;
    user.name = req.body.name;
    user.mail = req.body.abonent;
    db.get().collection("user").findOneAndUpdate({_id: id}, {
            $set: {
                number: user.number,
                name: user.name,
                mail: user.mail
            }
        },
        {returnOriginal: false}, function (err, result) {
            if (err) return res.status(400).send();
            var user = result.value;
            res.send(user);
        });
};


exports.gerIdAbonent = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var number = req.body.number;
    db.get().collection("user").findOne({number: number}, function (err, user) {
        res.send(user);
    });
};
