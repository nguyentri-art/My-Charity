const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatBox = new Schema({
    msg: {
        type: String
    },
    userName: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model("Chat Box", chatBox);