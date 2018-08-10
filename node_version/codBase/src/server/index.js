const http = require('http');
const express = require('express');
const bodyparse = require('body-parser');
const connection = require('./connection/connection');
const user = require('./handlers/user');
var event = require('./handlers/event');
const app = express();
const Server = http.createServer(app);

const PORT = 8080;

app.use(bodyparse.urlencoded({ 
    extended: false 
}));

app.use(bodyparse.json());

app.use(express.static('../client'));

app.use('/events', function(req, res, next) {
    connection.connect(req, res, next);
});

app.use('/user', function(req, res, next) {
    connection.connect(req, res, next);
});

app.use('/user/login', function(req, res, next) {
    user.login(req, res);
});

app.post('/events/all', function(req, res) {
    event.all(req, res);
});

app.post('/events/delete', function(req, res) {
    event.delete(req, res);
});

app.post('/events/update', function(req, res) {
    event.update(req, res);
});

app.post('/events/new', function(req, res) {
    event.new(req, res);
});

Server.listen(PORT, function() {
    console.log('Server is listening on port:', PORT);

    connection.otherConnect(function(error) {
        if (error) {
            connection.disconnect();
        } else {
            user.loadUser(function() {
                connection.disconnect();
            });
        }
    });
});