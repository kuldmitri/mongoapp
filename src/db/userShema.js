const mongoose = require('./mongoose');
const logger = require('../libs/logger')(module);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    number: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    mail: {type: String, required: true},
});

const UserModel = mongoose.model('User', UserSchema);

exports.UserModel = UserModel;