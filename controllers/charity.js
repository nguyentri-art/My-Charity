const myUser = require("../models/user");
const myEvent = require("../models/event");
const myChatting = require("../models/chatting");

//#region show path="/"

exports.main = (req, res, next) => {
    res.render("main", {
        pageTitle: "Philanthropic",
        path: "/"
    });
}
//#endregion