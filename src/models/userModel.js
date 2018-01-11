const logger = require('../libs/logger')(module);
const UserModel = require('../db/userShema').UserModel;
const httpErrors = require('../utils/httpErrors');

exports.all = (cb) => {
    UserModel.find((err, doc) => {
        cb(err, doc);
    });
};

exports.add = (obj, cb) => {
    if (!obj.number || !obj.name || !obj.mail) return cb(httpErrors.createBadRequestError(),null);
    UserModel.create(obj, (err, doc) => {
        cb(err, doc);
    });
};

exports.delete = (obj, cb) => {
    if (!obj.id) return cb(httpErrors.createBadRequestError(), null);
    UserModel.findByIdAndRemove(obj.id, (err, doc) => {
        cb(err, doc);
    });
};

exports.find = (obj, cb) => {
    const query = {
        name: new RegExp(obj.name, "i"),
        number: new RegExp(obj.number, "i"),
        mail: new RegExp(obj.mail, "i"),
    };
    UserModel.find(query, (err, doc) => {
        cb(err, doc);
    });
};