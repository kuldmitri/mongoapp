const {UserModel} = require('../db/userShema');

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
    const query = {
        name: new RegExp(obj.name, "i"),
        number: new RegExp(obj.number, "i"),
        mail: new RegExp(obj.mail, "i"),
    };
    UserModel.find(query, cb);
};