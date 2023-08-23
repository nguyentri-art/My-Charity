const myUser = require("../models/user");
const myEvent = require("../models/event");
const myChatting = require("../models/chatting");
const historyEvent = require("../models/historyDonation");

//#region show path="/"
exports.main = (req, res, next) => {
    /* checkAdmin region */
    console.log(req.session)
    //nếu chưa có session user, nếu chưa đăng nhập
    if (!req.session.user) {
        res.render("main", {
            pageTitle: "Philanthropic",
            path: "/",
            isAdmin: false
        });
    } else {
        const userId = req.session.user._id
        let checkAdmin
        myUser.findById(userId).then(user => {
            checkAdmin = user.isAdmin
            res.render("main", {
                pageTitle: "Philanthropic",
                path: "/",
                isAdmin: checkAdmin
            });
            // checkAdmin với user để hiện thị khung create Event
        }).catch(err => {
            console.log(err)
        })
    }

    /* checkAdmin region */
}
//#endregion

//#region get path="/aboutUs"
exports.aboutUs = (req, res, next) => {
    if (!req.session.user) {
        res.render("aboutUs", {
            pageTitle: "About Us",
            path: "/aboutUs",
            isAdmin: false
        });
    } else {
        const userId = req.session.user._id
        let checkAdmin
        myUser.findById(userId).then(user => {
            checkAdmin = user.isAdmin
            res.render("aboutUs", {
                pageTitle: "About Us",
                path: "/aboutUs",
                isAdmin: checkAdmin
            });
        }).catch(err => {
            console.log(err)
        })
    }
}
//#endregion

//#region get path="/donation"
exports.donation = (req, res, next) => {
    let signIn;
    if (!req.session.user) {
        signIn = false;
        myEvent.find().then(event => {
            res.render("donation", {
                pageTitle: "Donation",
                path: "/eventDonation",
                prods: event,
                isAdmin: false,
                user: signIn
            });
        })
    } else {
        const userId = req.session.user._id
        let checkAdmin
        signIn = true;
        myUser.findById(userId).then(user => {
            checkAdmin = user.isAdmin
            myEvent.find().then(event => {
                console.log(event)
                res.render("donation", {
                    pageTitle: "Donation",
                    path: "/eventDonation",
                    isAdmin: checkAdmin,
                    prods: event,
                    user: signIn
                });
            })
        }).catch(err => {
            console.log(err);
        })
    }
}
//#endregion

//#region get path="/createEvent"
exports.createEvent = (req, res, next) => {
    const userId = req.session.user._id
    let checkAdmin
    myUser.findById(userId).then(user => {
        checkAdmin = user.isAdmin
        res.render("createEvent", {
            pageTitle: "Create Event",
            path: "/createEvent",
            isAdmin: checkAdmin,
            prods: user,
        });
    })
}
//#endregion

//#region post path="/createEvent" 
exports.postCreateEvent = (req, res, next) => {
    const nameEvent = req.body.nameEvent //Name Event
    const imageEvent = req.body.imageEvent //Image Event
    const locationEvent = req.body.locationEvent //Location Event
    const desEvent = req.body.descriptionEvent  // Description Event
    const moneyEvent = req.body.totalMoney // Total Moeny
    const timeEvent = req.body.timeAction //  Time Action
    const teamEvent = req.body.teamAction // Team Event

    const empId = req.session.user._id
    const newEvent = new myEvent({
        nameEvent: nameEvent,
        imageUrl: imageEvent,
        locationEvent: locationEvent,
        description: desEvent,
        totalMoney: moneyEvent,
        createrEvent: empId,
        timeAction: timeEvent,
        teamAction: teamEvent,
        isAccept: true
    })
    res.redirect("/eventDonation")
    return newEvent.save();
}
//#endregion

//#region get detail event
exports.detailEvent = (req, res, next) => {
    const empId = req.session.user._id
    const eventId = req.params.eventId
    let checkAdmin
    myEvent.findById(eventId).then(event => {
        console.log(event)
        myUser.findById(empId).then(user => {
            checkAdmin = user.isAdmin
            res.render("detailEvent", {
                pageTitle: "Detail Event and Donation",
                path: "/detailDonation",
                isAdmin: checkAdmin,
                prods: event,
                eventId: eventId,
            })
        })
    })
}
//#endregion

//#region get update Event
exports.updateEvent = (req, res, next) => {
    const eventId = req.params.eventId
    const userId = req.session.user._id


    let checkAdmin
    console.log(userId.isAdmin)
    myEvent.findById(eventId).then(event => {
        console.log(event)
        res.render("updateEvent", {
            pageTitle: "Update Event",
            path: "/updateDonation",
            prods: event,
            isAdmin: userId.isAdmin
        });
    }).catch(err => {
        console.log(err)
    })
}
//#endregion    

//#region post update event
exports.postUpEvent = (req, res, next) => {
    const eventId = req.body.eventId

    const nameEvent = req.body.nameEvent
    const imageUrl = req.body.imageUrl
    const locationEvent = req.body.locationEvent
    const description = req.body.description
    const totalMoney = req.body.totalMoney
    const timeAction = req.body.timeAction
    const teamAction = req.body.teamAction

    myEvent.findById(eventId).then(event => {
        event.nameEvent = nameEvent
        event.imageUrl = imageUrl
        event.locationEvent = locationEvent
        event.description = description
        event.totalMoney = totalMoney
        event.timeAction = timeAction
        event.teamAction = teamAction
        return event.save().then(() => {
            res.redirect("/eventDonation")
        })
    }).catch(err => {
        console.log(err)
    })
}
//#endregion

//#region get path="/historyEvent"
exports.historyEvent = (req, res, next) => {
    if (!req.session.user) {
        historyEvent.find().then(user => {
            res.render("historyEvent", {
                pageTitle: "History Event",
                path: "/historyEvent",
                isAdmin: false
            });
        }).catch(err => {
            console.log(err);
        });
    } else {
        const userId = req.session.user._id
        let checkAdmin
        myUser.findById(userId).then(user => {
            checkAdmin = user.isAdmin
            historyEvent.find().then(history => {
                console.log(history);
                res.render("historyEvent", {
                    pageTitle: "History Event",
                    path: "/historyEvent",
                    isAdmin: checkAdmin,
                    prods: history,
                });
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        });
    }
}

//#endregion

//#region get path="/thanksto"
exports.thanksTo = (req, res, next) => {
    const userId = req.session.user._id;
    let checkAdmin
    myUser.findById(userId).then(user => {
        checkAdmin = user.isAdmin;
        res.render("thankstoDonation", {
            pageTitle: "Thanks to your help",
            path: "/thanksto",
            isAdmin: checkAdmin
        });
    })
}
//#endregion


