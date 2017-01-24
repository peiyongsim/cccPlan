var express = require('express'),
    app = express(),
    port = 3000 || process.env.port,
    path = require('path'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    _ = require('lodash'),
    dbq = require('./data/queries.js');

app.use(compression({
    threshold: 512
}));
// Serve static content from the public folder
app.use(express.static(path.join(__dirname, 'static')));
// Parse incoming json requests
app.use(bodyParser.json());


app.get('/from', function (req, res) {
    dbq.getFrom(function (list) {
        res.send(list);
    });
});

app.get('/to', function (req, res) {
    dbq.getTo(function (list) {
        res.send(list);
    });
});

app.get('/majors', function (req, res) {
    dbq.getMajors(req.query.from, req.query.to, function (list) {
        res.send(list);
    });
});

app.get('/table', function (req, res) {
    dbq.getTable(req.query.from, req.query.to, req.query.major, function (item) {
        console.log('table resp', item);
        res.send(item);
    });
});

app.get('/ids', function (req, res) {
    console.log(req.query);
    dbq.getClassIds(req.query, function (item) {
        res.send(item);
    });
});

app.get('/course', function (req, res) {
    dbq.getCourse(req.query, function (item) {
        res.send(item);
    });
});

// Listen at port 3000
app.listen(port);
console.log('Listening on port', port);