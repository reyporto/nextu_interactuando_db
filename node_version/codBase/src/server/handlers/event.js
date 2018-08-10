const mongoose = require('mongoose');
const schemas = require('../schemas/schemas');

exports.all = function(req, res) {
    var uModel = mongoose.model('usuarios', schemas.user);
    var eModel = mongoose.model('eventos', schemas.event);

    uModel.findOne({ '_id': req.body.user.toLowerCase() }, 'events')
    .populate('events').exec(function(error, doc) {
        if (error) console.log('Error: ', error.message);
        var events = error ? [] : doc.events;
        res.logAndSend(res, events);
    });
}

exports.new = function(req, res) {
    var title = req.body.title;
    var start = req.body.start;
    var user = req.body.user;
    var result = {
        message: 'Complete los campos obligatorios para el evento.',
        code: '0'
    };

    if (title && start && user) {
        var uModel = mongoose.model('usuarios', schemas.user);
        var eModel = mongoose.model('eventos', schemas.event);

        var eventModel = new eModel({
            title: title,
            start: start,
            start_hour: req.body.start_hour,
            end: req.body.end,
            end_hour: req.body.end_hour,
            allDay: req.body.allDay
        });

        uModel.findOne({ '_id' : user }, 'events', function(err1, doc) {
            if (err1) {
                console.log('Error: ', err1.message);
                result.message = err1.message;
                res.logAndSend(res, result);
            } else {
                eventModel.save(function(err2, event) {
                    if (err2) {
                        console.log('Error: ', err2.message);
                        result.message = err2.message;
                        res.logAndSend(res, result);
                    } else {
                        if (doc.events.indexOf(event._id) === -1) {
                            doc.events.push(event._id);

                            doc.save(function(err3) {
                                if (err3) {
                                    console.log('Error: ', err3.message);
                                    result.message = err3.message;
                                    res.logAndSend(res, result);
                                } else {
                                    result.message = 'Evento añadido a tu calendario.';
                                    result.code = '1';
                                    res.logAndSend(res, result);
                                }
                            });
                        } else {
                            result.message = 'Evento añadido a tu calendario.';
                            result.code = '1';
                            res.logAndSend(res, result);
                        }
                    }
                });
            }
        });
    } else {
        res.logAndSend(res, result);
    }
}

exports.delete = function(req, res) {
    var result = {
        code: '0',
        message: 'No se pudo eliminar el evento. Por favor, intente más tarde.'
    };

    if (req.body.id && req.body.user) {
        var uModel = mongoose.model('usuarios', schemas.user);
        var eModel = mongoose.model('eventos', schemas.event);

        uModel.findOne({ '_id' : req.body.user }, 'events', function(err1, doc) {
            if (err1) {
                console.log('Error: ', err1.message);
                res.logAndSend(res, result);
            } else {
                var index = doc.events.indexOf(req.body.id);
                var array = doc.events;

                if (index !== -1) {
                    array.splice(index, 1);
                    doc.events = array;

                    doc.save(function(err2) {
                        if (err2) {
                            console.log('Error: ', err2.message);
                            res.logAndSend(res, result);
                        } else {
                            eModel.remove({ '_id': req.body.id }, function(error) {
                                if (error) {
                                    console.log('Error: ', error.message);
                                    res.logAndSend(res, result);
                                } else {
                                    result.code = '1';
                                    result.message = 'Evento eliminado.';
                                    res.logAndSend(res, result);
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.logAndSend(res, result);
    }
}

exports.update = function(req, res) {
    var eModel = mongoose.model('eventos', schemas.event);

    eModel.update({ '_id': req.body._id }, {
        $set: {
            title: req.body.title,
            start: req.body.start,
            allDay: req.body.allDay,
            end: req.body.end,
            start_hour: req.body.start_hour,
            end_hour: req.body.end_hour
        }
    }, function(error, doc) {
        if (error) {
            console.log('Error: ', error.message);
            res.logAndSend(res, {
                code: '0',
                message: 'No se pudo actualizar el evento.'
            });
        } else {
            res.logAndSend(res, {
                code: '0',
                message: 'Evento actualizado.'
            });
        }
    });
}