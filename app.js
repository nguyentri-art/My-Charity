const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin__um:Grmk49g8G8XuFRR6@charity.csjw7.mongodb.net/myCharity?retryWrites=true&w=majority"

const charitRoutes = require("./routes/landing");


const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

//Routes
app.use(charitRoutes)

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGODB_URI).then(result => {
    app.listen(3000)
}).catch(err => console.log(err))
console.log("this work")

