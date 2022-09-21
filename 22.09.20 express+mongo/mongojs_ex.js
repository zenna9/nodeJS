const mongojs = require('mongojs');
const http = require('http');
const express = require('express');
const app = express();

app.set('port', 3000);

app.get('/', function(req, res) {
    const db = mongojs('vehicle', ['car']);
    db.car.find({}, function(err, data) {
        res.send(data);
        db.close();
    });
});

const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('run on server : http://localhost:' + app.get('port'));
});