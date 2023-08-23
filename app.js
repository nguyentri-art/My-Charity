const path = require('path');
const paypal = require('paypal-rest-sdk');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const eventModel = require("./models/event");
const userModel = require("./models/user");
const historyDonation = require("./models/historyDonation");
const chatboxModel = require("./models/chatting");

const errorLoadPage = require("./controllers/error");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const flash = require('connect-flash');
const multer = require('multer');

const MONGODB_URI = "mongodb+srv://admin__um:Grmk49g8G8XuFRR6@charity.csjw7.mongodb.net/myCharity?retryWrites=true&w=majority"

const charitRoutes = require("./routes/landing");

const app = express();




// #region store 
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
// #endregion

//#region check session 
app.use((req, res, next) => {
    if (req.session === null || req.session === undefined) {
        return next();
    }
    userModel.findById(req.session.user._id).then(user => {
        if (!user) {
            return next();
        }
        req.user = user
        next();
    }).catch(err => {
        next(new Error(err));
    })

})
//#endregion


app.set("view engine", "ejs");
app.set("views", "views");

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

// #region session
app.use(
    session({
        secret: "SERCET THINGS",
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
//#endregion

app.use(flash());

// #region session isLogin
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // console.log(req.locals.isAuthenticated)
    // next();
    console.log(res.locals.isAuthenticated + " this Authenticated")
    next();
})
// #endregion
// paypal

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AV2l1Rjwge1DCPoJ7V72iCtGWJhWt-tLoarEh8i2hRSCu-x0XeOnnbAFGd2aD-Jp4w-CnXwDoVs5qz19',
    'client_secret': 'EJV-SB0vvZISpJikIOhcBcE0KZVdY5xYJJ0BCap6KGDgjIbD7otGjBRV6OvkzuseQQTMw3jqN_nSPbRe'
});

let totalMoney;

app.post('/pay', async (req, res) => {
    // tạo những tham số ngoài này được lấy ra bỡi thằng Donation Event
    var eventName
    const myEventId = req.body.eventId;

    await eventModel.findOne({ _id: myEventId }).then(event => {
        eventName = event.nameEvent;
    }).catch(err => {
        console.log(err);
    });

    console.log(myEventId + "req.body.eventId");
    const userValueDonat = req.body.moneyDonation;
    totalMoney = userValueDonat;
    console.log(userValueDonat + "req.body.moneyDonation");

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": eventName,
                    "sku": "001",
                    "price": userValueDonat,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": userValueDonat
            },
            "description": "Donation thing make you feel more humaniti"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
});



app.get('/success', (req, res) => {

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;



    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": totalMoney
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            // console.log(payment.payer.payer_info.email);
            console.log(payment.transactions[0].item_list.items[0]);
            // console.log(payment);

            const idEvent = payment.transactions[0].item_list.items[0].name;
            console.log(idEvent + "idEvent");
            const userEmail = payment.payer.payer_info.email;
            console.log(userEmail + "userEmail");
            const userFirstName = payment.payer.payer_info.first_name;
            console.log(userFirstName + "firstName");
            const userLastName = payment.payer.payer_info.last_name;
            console.log(userLastName + "lastName")
            const userTotal = payment.transactions[0].amount.total;
            console.log(userTotal + "toTal")

            const newUser = new historyDonation({
                email: userEmail,
                first_name: userFirstName,
                last_name: userLastName,
                total: userTotal,
                idEvent: idEvent
            });
            newUser.save();
            res.redirect("/thanksto");
        }
    });
});

app.get("/cancel", (req, res) => res.send("Cancelled"));


//Routes
app.use(charitRoutes);

app.use(errorLoadPage.get404);



//#endregion paypal

mongoose.connect(MONGODB_URI).then(result => {
    app.listen(3000)
}).catch(err => console.log(err))
console.log("this work")

