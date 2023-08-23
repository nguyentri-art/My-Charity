const express = require('express');
const { check, body } = require("express-validator/check");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

const charity = require("../controllers/charity");

const auth = require("../controllers/auth");

//chưa có isAuth

//get  Main
router.get("/", charity.main);

//get About Us
router.get("/aboutUs", charity.aboutUs);

//get Donation
router.get("/eventDonation", charity.donation);
router.get("/detailDonation/:eventId", charity.detailEvent);
router.get("/updateDonation/:eventId", charity.updateEvent);
//post Donation
router.post("/updateDonation/:eventId", charity.postUpEvent);

//get Create Event
router.get("/createEvent", charity.createEvent);
//post Create Event
router.post("/createEvent", charity.postCreateEvent);

//thanks to donation people
//get 
router.get("/thanksto", charity.thanksTo);

//get History Event
router.get("/historyEvent", charity.historyEvent)

//get auth signIn
router.get("/signIn", auth.signIn);



//post auth signIn
router.post("/signIn", [
    body('email')
        .isEmail()
        .withMessage("Enter a correct email address. ")
        .normalizeEmail(),
    body('password', "Password has to be correct")
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], auth.postSignIn)

//post auth signOut
router.post('/signOut', auth.signOut);

//get auth signUp
router.get("/signUp", auth.signUp);

module.exports = router;