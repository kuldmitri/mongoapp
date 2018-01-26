const csv = require('csv');
const common = require('../utils/common');
const fs = require('fs');

const _ = require('lodash');

module.exports.deleteById = (filePath, id, cb) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      logger.error('[AddBook] Read csv file failed', err);
      return cb(err);
    }
    csv.parse(data, {columns: true}, (err, arr) => {
      if (err) return cb(err);
      arr.map((current) => {
        _.forIn(current, (value, key) => {
          if (!current[key]) {
            current[key] = null;
          }
        });
      });
      common.deleteById(arr, id);
      csv.stringify(arr, {header: true}, (err, csvData) => {
        if (err) return cb(err);
        fs.writeFile(filePath, csvData, (err) => {
          if (err) return cb(err);
          return cb(null, arr);
        });
      });
    });
  });
};

module.exports.addNew = (filePath, obj, cb) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      logger.error('[AddBook] Read csv file failed', err);
      return cb(err);
    }
    csv.parse(data, {columns: true}, (err, arr) => {
      if (err) return cb(err);
      arr.map((current) => {
        _.forIn(current, (value, key) => {
          if (!current[key]) {
            current[key] = null;
          }
        });
      });
      common.addNew(arr, obj);
      csv.stringify(arr, {header: true}, (err, csvData) => {
        if (err) return cb(err);
        fs.writeFile(filePath, csvData, (err) => {
          if (err) return cb(err);
          return cb(null, obj);
        });
      });
    });
  });
};

module.exports.updateById = (filePath, id, obj, cb) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      logger.error('[AddBook] Read csv file failed', err);
      return cb(err);
    }
    csv.parse(data, {columns: true}, (err, arr) => {
      if (err) return cb(err);
      arr.map((current) => {
        _.forIn(current, (value, key) => {
          if (!current[key]) {
            current[key] = null;
          }
        });
      });
      common.updateById(arr, id, obj);
      csv.stringify(arr, {header: true}, (err, csvData) => {
        if (err) return cb(err);
        fs.writeFile(filePath, csvData, (err) => {
          if (err) return cb(err);
          return cb(null, obj);
        });
      });
    });
  });
};

module.exports.find = (filePath, query, cb) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      logger.error('[AddBook] Read csv file failed', err);
      return cb(err);
    }
    csv.parse(data, {columns: true}, (err, arr) => {
      if (err) return cb(err);
      arr.map((current) => {
        _.forIn(current, (value, key) => {
          if (!current[key]) {
            current[key] = null;
          }
        });
      });
      common.find(arr, query);
      return cb(null, arr);
    });
  });
};
