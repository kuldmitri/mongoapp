var logger = require('../libs/logger')(module);
var UserModel = require('../db/userShema').UserModel;
const httpErrors = require('../utils/httpErrors');

exports.get = (req, res) => {
    return UserModel.find((err, users) => {
        if (err) return next(err);
        return res.send(users);
    });
};

exports.add = (req, res) => {
    if (!req.body.number || !req.body.name || !req.body.mail) return next(httpErrors.createBadRequestError());
    var user = new UserModel({
        number: req.body.number,
        name: req.body.name,
        mail: req.body.mail
    });
    user.save((err) => {
        if (err) return next(err);
        logger.debug('User add', {user});
        return res.send({user});
    });
};

exports.delete = (req, res) => {
    if (!req.body.id) return next(httpErrors.createBadRequestError());
    UserModel.findByIdAndRemove(req.body.id, (err, result) => {
        if (err) return next(err);
        res.send(result.value);
    });
};

exports.update = (req, res) => {
    if (!req.body.id) return next(httpErrors.createBadRequestError());
    var user = new UserModel({
        number: req.body.number,
        name: req.body.name,
        mail: req.body.mail
    });
    UserModel.findOneAndUpdate(req.body.id, user, (err, result) => {
        if (err) return next(err);
        res.send(result.value);
    });
};