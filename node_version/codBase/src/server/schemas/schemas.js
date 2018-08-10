const Schema = require('mongoose').Schema;

exports.user = new Schema({
    _id: String,
	name:  String,
    email: String,
    birthday: Date,
    password: String,
    events: [{
        type: String,
        ref: 'eventos'
    }]
});

exports.event = new Schema({
    title: String,
    start: String,
    start_hour: String,
    end: String,
    end_hour: String,
    allDay: {
        type: Boolean,
        default: false
    }
});