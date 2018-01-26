const mongoose = require('./mongoose');
const logger = require('../libs/logger')(module);
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  name: {type: String, required: true},
  author: {type: String, required: true},
  issuedto: {type: Schema.ObjectId},
  issued: {type: String}
});

const BookModel = mongoose.model('Book', BookSchema);

module.exports.BookModel = BookModel;
