const _ = require('lodash');

module.exports.deleteById = (arr, id) => {
    const i = _.findIndex(arr, (o) => {
        return o._id === id;
    });
    let obj = arr[i];
    _.remove(arr, function (n) {
        return n._id === id;
    });
    return obj;
};

module.exports.addNew = (arr, obj) => {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        if (parseInt(arr[i]._id) > max) {
            max = parseInt(arr[i]._id);
        }
    }
    obj._id = (max + 1).toString();
    arr.push(obj);
    return obj;
};

module.exports.updateById = (arr, id, obj) => {
    const i = _.findIndex(arr, (o) => {
        return o._id === id;
    });
    _.assign(arr[i], obj);
    return arr[i];
};

module.exports.find = (arr, obj) => {
    let filtered = _.filter(arr, (o) => {
        let isTrue = true;
        _.forIn(obj, (value, key) => {
            if (!obj[key].test(o[key])) {
                isTrue = false;
            }
        });
        return isTrue
    });
    return filtered
};