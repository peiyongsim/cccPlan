var MongoClient = require('mongodb').MongoClient,
    dbConnection = 'mongodb://127.0.0.1:27017/cccPlanDb',
    _ = require('lodash');

var getDistinct = function (collection, field, query, callback) {
    MongoClient.connect(dbConnection, function (err, db) {
        if (err) {
            throw err;
        }

        db.collection(collection).distinct(field, function (err, data) {
            callback(data);
            db.close();
        });
    });
};

var getWhere = function (collection, query, callback) {
    MongoClient.connect(dbConnection, function (err, db) {
        if (err) {
            throw err;
        }

        db.collection(collection).find(query).toArray(function (err, data) {
            callback(data);
            db.close();
        });
    });
};

module.exports.getFrom = function (callback) {
    getDistinct('agreements', 'from', {}, callback);
};

module.exports.getTo = function (callback) {
    getDistinct('agreements', 'to', {}, callback);
};

module.exports.getMajors = function (from, to, callback) {
    getWhere('agreements', {
        from: from,
        to: to
    }, function (items) {
        callback(_.pluck(items, 'major'));
    });
};


module.exports.getClassIds = function (query, callback) {

    var itemQuery = {
        college: query.college,
    };
    console.log(itemQuery);
    getWhere('courses', itemQuery, function (items) {
        console.log('this should not be blank', items);
        callback(_.pluck(items, 'id').filter( function (item) {
            return item !== '';
        }));
    });
};



module.exports.getCourse = function (query, callback) {
    getWhere('courses', {
        college: query.college,
        id: query.id
    }, function (items) {
        callback(items[0]);
    });
};


module.exports.getTable = function (from, to, major, callback) {
    console.log(from, to, major);
    getWhere('agreements', {
        from: from,
        to: to,
        major: major
    }, function (items) {
        callback((items[0] || {
            table: []
        }).table);
    });
};