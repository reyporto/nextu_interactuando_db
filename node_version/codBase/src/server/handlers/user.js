const mongoose = require('mongoose');
const schemas = require('../schemas/schemas');
const crypto = require('../crypto/crypto');

exports.loadUser = function(callback) {
    var model = mongoose.model('usuarios', schemas.user);
    var password = crypto.encrypt('123456');

    var user = new model({
        _id: 'usuario@nextu.com',
        name: 'Usuario NextU',
        email: 'usuario@nextu.com',
        birthday: new Date('1987-01-15'),
        password: password,
        events: []
    });

    user.save(function(error) {
        if (error) {
            console.log('Error: ', error.message);
        } else {
            console.log('Registered user!');
        }

        callback();
    });
}

exports.login = function(req, res) {
    var model = mongoose.model('usuarios', schemas.user);
    var result = {
        message: 'Complete todos los campos.'
    };

    if (req.body.user && req.body.pass) {
        model.findOne({ '_id': req.body.user.toLowerCase() }, 'email password', function(error, doc) {
            if (error) {
                res.logAndSend(res, error);
            } else {
                var decryptedPass = crypto.decrypt(doc.password);

                if (decryptedPass === req.body.pass) {
                    result.message = 'Validado';
                } else {
                    result.message = 'Email o contraseña incorrectos.';
                }

                res.logAndSend(res, result);
            }
        });
    } else {
        res.logAndSend(res, result);
    }
}