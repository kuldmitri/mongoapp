var objectId = require("mongodb").ObjectID;

exports.getUsers = function (req, res) {
    global.db.collection("user").find({}).toArray(function (err, users) {
        res.render('user.hbs', {user: users});
    });
};


exports.addUser = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var user = {};
    user.number = req.body.number;
    user.name = req.body.name;
    user.mail = req.body.mail;
    global.db.collection("user").insertOne(user, function (err, result) {
        if (err) return res.status(400).send();
        res.send(result.value);
    });
};

exports.deleteUser = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    global.db.collection("user").findOneAndDelete({_id: id}, function (err, result) {
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
    global.db.collection("user").findOneAndUpdate({_id: id}, {
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
    global.db.collection("user").findOne({number: number}, function (err, user) {
        res.send(user);
    });
};
