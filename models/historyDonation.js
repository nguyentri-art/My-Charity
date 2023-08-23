const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const historyDonation = new Schema({
    email: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    total: {
        type: String,
        required: true
    },
    idEvent: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("History", historyDonation);