const _ = require('lodash');
const logger = require('../libs/logger')(module);
const {BookModel} = require('../db/bookShema');
const {UserModel} = require('../db/userShema');
const csv = require('csv');
const httpErrors = require('../utils/httpErrors');
const fs = require("fs");
const dbInArr = require('../utils/common');
const async = require('async');


exports.findAll = (cb) => {
    async.parallel({
        db: (next) => {
            BookModel.find({}, (err, arrMongo) => {
                if (err) return cb(err);
                arrMongo.map((current) => {
                    current._doc.base = 'Mongo';
                    return JSON.parse(JSON.stringify(current));
                });
                next(null, arrMongo);
            });

        },
        csv: (next) => {
            csv.parse(fs.readFileSync(process.env.pathBookCSVdb), {columns: true}, (err, arr) => {
                if (err) return cb(err);
                arr.map((current) => {
                    current.base = 'CSV';
                });
                next(null, arr);
            });
        }
    }, (err, results) => {
        if (err) return cb(err);
        cb(null, _.concat(results.db, results.csv));
    });
};

exports.issueBook = (obj, cb) => {
    const id = _.get(obj, 'id');
    const number = _.get(obj, 'number');
    const base = _.get(obj, 'base');
    if (!id || !number || !base) return cb(httpErrors.createBadRequestError(), null);

    let date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    UserModel.findOne({number: number}, (err, user) => {
        if (err) return cb(err);
        if (!user) return cb(httpErrors.createNotFoundNumberError(number), null);
        switch (base) {
            case 'Mongo':
                BookModel.findByIdAndUpdate(id, {issued: date, issuedto: user._id}, {new: true}, (err, book) => {
                    cb(err, book);
                });
                break;
            case 'CSV':
                csv.parse(fs.readFileSync(process.env.pathBookCSVdb), {columns: true}, (err, arr) => {
                    const book = dbInArr.updateById(arr, id, {issued: date, issuedto: user._id});
                    csv.stringify(arr, {header: true}, (err, csvData) => {
                        if (err) return cb(err);
                        fs.writeFile(process.env.pathBookCSVdb, csvData, (err) => {
                            if (err) return cb(err);
                            return cb(null, book);
                        })
                    });
                });
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
            csv.parse(fs.readFileSync(process.env.pathBookCSVdb), {columns: true}, (err, arr) => {
                if (err) return cb(err);
                dbInArr.updateById(arr, obj.id, {issued: null, issuedto: null});
                csv.stringify(arr, {header: true}, (err, csvData) => {
                    fs.writeFile(process.env.pathBookCSVdb, csvData, (err) => {
                        if (err) return cb(err);
                        return cb(null, arr);
                    })
                })
            });
            break;
    }
};

exports.findByNameAndAuthor = (obj, cb) => {
    const query = {
        name: new RegExp(obj.name, "i"),
        author: new RegExp(obj.author, "i")
    };

    async.parallel({
        db: (next) => {
            BookModel.find(query, (err, arrMongo) => {
                if (err) return next(err);
                arrMongo.map((current) => {
                    current._doc.base = 'Mongo';
                    return JSON.parse(JSON.stringify(current));
                });
                next(null, arrMongo);
            });

        },
        csv: (next) => {
            csv.parse(fs.readFileSync(process.env.pathBookCSVdb), {columns: true}, (err, arr) => {
                if (err) return next(err);
                let arrCVS = dbInArr.find(arr, query);
                arrCVS.map((current) => {
                    current.base = 'CSV';
                });
                next(null, arrCVS);
            });
        }
    }, (err, results) => {
        if (err) return cb(err);
        cb(null, _.concat(results.db, results.csv));
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
            let data;
            try {
                data = fs.readFileSync(process.env.pathBookCSVdb);
            } catch (err) {
                logger.error('[AddBook] Read csv file failed', err);
                return cb(err);
            }
            csv.parse(data, {columns: true}, (err, arr) => {
                if (err) return cb(err);
                dbInArr.addNew(arr, obj.book);
                csv.stringify(arr, {header: true}, (err, books) => {
                    fs.writeFile(process.env.pathBookCSVdb, books, (err) => {
                        if (err) return cb(err);
                        return cb(null, arr);
                    })
                })
            });
            break;
        default :
            logger.error('Unknown DB type')
            throw new Error('Unknown DB type');
    }
};


exports.deleteBook = (obj, cb) => {
    switch (obj.base) {
        case 'Mongo':
            BookModel.findByIdAndRemove(obj.id, cb);
            break;
        case 'CSV':
            csv.parse(fs.readFileSync(process.env.pathBookCSVdb), {columns: true}, (err, arr) => {
                let book = dbInArr.deleteById(arr, obj.id);
                csv.stringify(arr, {header: true}, (err, csvData) => {
                    if (err) return cb(err);
                    fs.writeFile(process.env.pathBookCSVdb, csvData, (err) => {
                        if (err) return cb(err);
                        return cb(null, book);
                    })
                });
            });
            break;
    }
};
