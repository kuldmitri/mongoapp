const UserModel = require('../db/userShema').UserModel;

exports.findAll = (cb) => {
    UserModel.find({},cb);
};

exports.addUser = (obj, cb) => {
    UserModel.create(obj, cb);
};

exports.deleteUser = (obj, cb) => {
    UserModel.findByIdAndRemove(obj.id, cb);
};

exports.findUser = (obj, cb) => {
    UserModel.findUser(obj, cb);
};