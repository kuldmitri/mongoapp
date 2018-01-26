const _ = require('lodash');
const logger = require('../libs/logger')(module);
const {BookModel} = require('../db/bookShema');
const {UserModel} = require('../db/userShema');
const dbInArr = require('../utils/common');
const httpErrors = require('../utils/httpErrors');
const async = require('async');
const csvDatabase = require('../db/csvDatabase');

exports.findAll = (cb) => {

    const mongoReq = new Promise((resolve, reject) => {
        BookModel.find({}, (err, arrMongo) => {
            if (err) reject(err);
            arrMongo.map((current) => {
                current._doc.base = 'Mongo';
                return JSON.parse(JSON.stringify(current));
            });
            resolve(arrMongo);
        });
    });

    const csvReq = new Promise((resolve, reject) => {
        csvDatabase.find(process.env.pathBookCSVdb, {}, (err, arr) => {
            if (err) reject(err);
            arr.map((current) => {
                current.base = 'CSV';
            });
            resolve(arr);
        });
    });

    Promise.all([mongoReq, csvReq])
        .then(results => {
            cb(null, _.concat(results[0], results[1]));
        }, error => {
            cb(error);
        });
};

exports.issueBook = (obj, cb) => {
    const id = _.get(obj, 'id');
    const number = _.get(obj, 'number');
    const base = _.get(obj, 'base');
    if (!id || !number || !base) return cb(httpErrors.createBadRequestError(), null);

    let date = new Date();
    date = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    UserModel.findOne({number: number}, (err, user) => {
        if (err) return cb(err);
        if (!user) return cb(httpErrors.createNotFoundNumberError(number), null);
        switch (base) {
            case 'Mongo':
                BookModel.findByIdAndUpdate(id, {issued: date, issuedto: user._id}, {new: true}, cb);
                break;
            case 'CSV':
                csvDatabase.updateById(process.env.pathBookCSVdb, id, {issued: date, issuedto: user._id}, cb);
                break;
        }
    });
};

exports.returnBook = (obj, cb) => {
    switch (obj.base) {
        case 'Mongo':
            BookModel.findByIdAndUpdate(obj.id, {issued: null, issuedto: null}, {new: true}, cb);
            break;
        case 'CSV':
            csvDatabase.updateById(process.env.pathBookCSVdb, obj.id, {issued: null, issuedto: null}, cb);
            break;
    }
};

exports.findByNameAndAuthor = (obj, cb) => {
    const query = {
        name: new RegExp(obj.name, 'i'),
        author: new RegExp(obj.author, 'i')
    };

    const mongoReq = new Promise((resolve, reject) => {
        BookModel.find(query, (err, arrMongo) => {
            if (err) reject(err);
            arrMongo.map((current) => {
                current._doc.base = 'Mongo';
                return JSON.parse(JSON.stringify(current));
            });
            resolve(arrMongo);
        });
    });

    const csvReq = new Promise((resolve, reject) => {
        csvDatabase.find(process.env.pathBookCSVdb, query, (err, arr) => {
            if (err) reject(err);
            const arrCVS = dbInArr.find(arr, query);
            arrCVS.map((current) => {
                current.base = 'CSV';
            });
            resolve(arrCVS);
        });
    });

    Promise.all([mongoReq, csvReq])
        .then(results => {
            cb(null, _.concat(results[0], results[1]));
        }, error => {
            cb(error);
        });
};

exports.addNewBook = (obj, cb) => {
    obj.book.issued = null;
    obj.book.issuedto = null;

    switch (obj.base) {
        case 'Mongo':
            BookModel.create(obj.book, cb);
            break;
        case 'CSV':
            csvDatabase.addNew(process.env.pathBookCSVdb, obj.book, cb);
            break;
        default:
            logger.error('Unknown DB type');
            throw new Error('Unknown DB type');
    }
};

exports.deleteBook = (obj, cb) => {
    switch (obj.base) {
        case 'Mongo':
            BookModel.findByIdAndRemove(obj.id, cb);
            break;
        case 'CSV':
            csvDatabase.deleteById(process.env.pathBookCSVdb, obj.id, cb);
            break;
    }
};
