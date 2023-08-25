const { validationResult } = require('express-validator/check');

const myUser = require("../models/user");


//#region show get path="/signIn"
exports.signIn = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    res.render("singIn", {
        pageTitle: "Sign In",
        path: "/signIn",
        errorMessage: message,
        isAdmin: false,
        oldInput: {
            email: "",
            password: "",
        },
        validationErrors: []
    });
}
//#endregion

//#region post path="/signIn"
exports.postSignIn = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    console.log(password.length);

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('singIn', {
            pageTitle: "Sign In",
            path: "/signIn",
            errorMessage: message,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array(),
            isAdmin: false,
        });
    }
    // #region điều kiện login
    myUser.findOne({ email: email, password: password }).then(user => {
        //nếu sai mật khẩu hoặc là tên đăng nhập
        if (!user) {
            return res.status(422).render("singIn", {
                path: "/signIn",
                pageTitle: "Sign In",
                errorMessage: 'Invalid email or password',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: [],
                isAdmin: false,
            });
        }
        //#endregion kết thúc điều kiện
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
            console.log(err);
            res.redirect("/");
        })
        // }).catch(err => {
        //     const error = new Error(err);
        //     error.httpStatusCode = 500;
        //     return next(error);
        // })
    })
}
//#endregion

//#region Post Sign Out
exports.signOut = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}
//#endregion

//#region get path="/signUp" 
exports.signUp = (req, res, next) => {
    res.render("signUp", {
        pageTitle: "Sign Up",
        path: "/signUp"
    })
}
//#endregion

//#region post path="/signUp"
exports.PostsignUp = (req,res,next) => {
   const emailSignup = req.body.email__signUp
   const passwordSignup = req.body.password__signUp
   const userNameSignUp = req.body.userName__signUp
   const userLocation = req.body.userLocation__signUp

//    const empId = req.session.user._id
//    console.log(empId);

   const newUser = new myUser({
        name:userNameSignUp,
        phoneNumber: 123456789,
        email:emailSignup,
        password:passwordSignup,
        location:userLocation,
        limitEvent:2,
        isAdmin:false
   })
   res.redirect("/")
   return newUser.save();
}
//#endregion

//#region paypal


//#endregion