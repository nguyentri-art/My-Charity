const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chattingBox = new Schema({
    userName: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chatBox: {
        type: String,
        minLength: 1,
    }
});

module.exports = mongoose.model("ChatBox", chattingBox);