const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventDonation = new Schema({
    nameEvent: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    locationEvent: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    totalMoney: {
        type: Number,
        required: true
    },
    createrEvent: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timeAction: {
        type: String,
        required: true,
    },
    teamAction: {
        type: String,
        required: true,
    },
    isAccept: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventDonation);