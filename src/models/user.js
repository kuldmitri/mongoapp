var mongoose = require('../db/mongoose');
var logger = require('../libs/logger')(module);
var Schema = mongoose.Schema;

var User = new Schema({
    number: {type: String, required: true},
    name: {type: String, required: true},
    mail: {type: String, required: true},
});

var UserModel = mongoose.model('User', User);

module.exports.UserModel = UserModel;