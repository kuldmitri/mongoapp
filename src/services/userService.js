const logger = require('../libs/logger')(module);
const UserModel = require('../db/userShema').UserModel;
const httpErrors = require('../utils/httpErrors');

exports.findAll = (cb) => {
    UserModel.findAll(cb);
};

exports.addUser = (obj, cb) => {
    if (!obj.number || !obj.name || !obj.mail) return cb(httpErrors.createBadRequestError(),null);
    UserModel.addUser(obj, cb);
};

exports.deleteUser = (obj, cb) => {
    UserModel.deleteUser(obj, cb);
};

exports.findUser = (obj, cb) => {
    UserModel.findUser(obj, cb);
};