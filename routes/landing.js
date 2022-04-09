const express = require('express');

const router = express.Router();

const charity = require("../controllers/charity");

//chưa có isAuth

//get  Main
router.get("/", charity.main);


module.exports = router;