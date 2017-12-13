var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/Library";

exports.getUsers = function (req, res) {
    mongoClient.connect(url, function (err, db) {
        db.collection("user").find({}).toArray(function (err, users) {
            res.send(users);
            db.close();
        });
    });
};


exports.addUser = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var user = {};
    user.number = req.body.number;
    user.name = req.body.name;
    user.mail = req.body.mail;

    mongoClient.connect(url, function (err, db) {
        db.collection("user").insertOne(user, function (err, result) {
            if (err) return res.status(400).send();
            res.send(result.value);
            db.close();
        });
    });
};

exports.deleteUser = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    mongoClient.connect(url, function (err, db) {
        db.collection("user").findOneAndDelete({_id: id}, function (err, result) {
            if (err) return res.status(400).send();
            var user = result.value;
            res.send(user);
            db.close();
        });
    });
};

exports.updateUser = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var user = {};
    user.number = req.body.author;
    user.name = req.body.name;
    user.mail = req.body.abonent;

    mongoClient.connect(url, function (err, db) {
        db.collection("user").findOneAndUpdate({_id: id}, {
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
                db.close();
            });
    });
};


exports.gerIdAbonent = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var number = req.body.number;

    mongoClient.connect(url, function (err, db) {
        db.collection("user").findOne({number: number}, function (err, user) {
            res.send(user);
            db.close();
        });
    });
};
