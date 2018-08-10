const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const HOST = 'localhost';
const PORT = 27017;
const DB_NAME = 'c7';

var disconnect = function(req) {
    console.log('Closing connection');

    mongoose.disconnect(function(error) {
        if (error) {
            console.log('Error: ', error);
        } else {
            console.log('Connection closed!');
        }

        if (req) {
            console.log('Exiting service: ', req.originalUrl);
        }
    });
}

exports.disconnect = disconnect;

exports.connect = function(req, res, next) {
    console.log('Mongoose connect...');
    console.log('Request: ', req.body);

    var uri = 'mongodb://' + HOST + ':' + PORT + '/' + DB_NAME;
    var finish = function() {
        console.log('Closing connection');
    
        mongoose.disconnect(function(error) {
            if (error) {
                console.log('Error: ', error);
            } else {
                console.log('Connection closed!');
            }
    
            console.log('Exiting service: ', req.originalUrl);
        });
    }

    mongoose.connect(uri, { useNewUrlParser: true }, function(error) {
        if (error) {
            console.log('Error: ', error);
            res.status(500);
            res.json(err);
        } else {
            res.logAndSend = function(response, send) {
                console.log('Response: ', send);
                response.json(send);
            }
    
            res.on('finish', finish);
            res.on('close', finish);
            next();
        }
    });
}

exports.otherConnect = function(callback) {
    var uri = 'mongodb://' + HOST + ':' + PORT + '/' + DB_NAME;
    console.log('Mongoose connect...');

    mongoose.connect(uri, { useNewUrlParser: true }, function(error) {
        if (error) {
            console.log('Error: ', error);
            callback(error);
        } else {
            callback();
        }
    });
}