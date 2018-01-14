const mongoose = require('./mongoose');
const logger = require('../libs/logger')(module);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    number: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    mail: {type: String, required: true},
});

UserSchema.statics.findAll = function (cb) {
    return this.find((err, doc) => {
        cb(err, doc);
    });
};

UserSchema.statics.addUser = function (obj, cb) {
    return this.create(obj, (err, doc) => {
        cb(err, doc);
    });
};

UserSchema.statics.deleteUser = function (obj, cb) {
    return this.findByIdAndRemove(obj.id, (err, doc) => {
        cb(err, doc);
    });
};

UserSchema.statics.findUser = function (obj, cb) {
    const query = {
        name: new RegExp(obj.name, "i"),
        number: new RegExp(obj.number, "i"),
        mail: new RegExp(obj.mail, "i"),
    };
    UserModel.find(query, (err, doc) => {
        cb(err, doc);
    });
};

const UserModel = mongoose.model('User', UserSchema);

module.exports.UserModel = UserModel;