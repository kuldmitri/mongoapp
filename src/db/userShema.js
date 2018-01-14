const mongoose = require('./mongoose');
const logger = require('../libs/logger')(module);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    number: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    mail: {type: String, required: true},
});

UserSchema.statics.findUser = function (obj, cb) {
    const query = {
        name: new RegExp(obj.name, "i"),
        number: new RegExp(obj.number, "i"),
        mail: new RegExp(obj.mail, "i"),
    };
    UserModel.find(query, cb);
};

const UserModel = mongoose.model('User', UserSchema);

module.exports.UserModel = UserModel;