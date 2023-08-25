const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userInfo = new Schema({
    name: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    location: {
        type: String,
    },
    limitEvent: {
        type: Number,
    },
    isAdmin: {
        type: Boolean,
        require: true,
    }
}, { timestamp: true });

module.exports = mongoose.model('User', userInfo);