var logger = require('../libs/logger')(module);
var UserModel = require('../db/userShema').UserModel;

exports.get = function (req, res) {
    return UserModel.find(function (err, users) {
        if (err) return getServerError(err, res);
        return res.send(users);
    });
};


exports.add = function (req, res) {
      if (!req.body) return res.sendStatus(400);
    var user = new UserModel({
        number: req.body.number,
        name: req.body.name,
        mail: req.body.mail
    });
    user.save(function (err) {
        if (err) return getServerError(err, res);
        logger.debug("User created", {user});
        return res.send({user});
    });
};

exports.delete = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = req.body.id;
   UserModel.findByIdAndRemove(id , function (err, result) {
        if (err) return res.status(400).send();
        var user = result.value;
        res.send(user);
    });
};

exports.update = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var user = new UserModel({
        number: req.body.number,
        name: req.body.name,
        mail: req.body.mail
    });
    UserModel.findOneAndUpdate(id , user,  function (err, result) {
            if (err) return res.status(400).send();
            var user = result.value;
            res.send(user);
        });
};


exports.gerIdAbonent = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var number = req.body.number;
    UserModel.findOne({number: number}, function (err, user) {
        res.send(user);
    });
};

function getServerError(err, res) {
    res.statusCode = 500;
    logger.error('Internal error(%d): %s', res.statusCode, err.message);
    return res.send({error: 'Server error'});
}