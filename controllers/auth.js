const bcrypt = require("bcryptjs");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator/check");
require("dotenv").config();

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    headTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    }
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      headTitle: "Login",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      }
    });
  }
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid Email or Password.");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((result) => {
        if (result) {
          req.session.loggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        // return res.redirect("login");
      })
      .catch((err) => {
        console.log(err);
        return res.redirect("/login");
      });
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signUp",
    headTitle: "SignUp",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    }
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signUp",
      headTitle: "SignUp",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        //for Keeping User Input in thr input fields when an error occurs
        email: email,
        password: password
      }
    });
    // return res.status(422).json({ errors: errors.array()[0].msg });
  }
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists!");
        return res.redirect("/signup");
      }
      bcrypt
        .hash(password, 12)
        .then((hashedpassword) => {
          const user = new User({
            email: email,
            password: hashedpassword
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: email,
            from: "nodeJSPractice@example.com",
            subject: "Sign Up successful",
            html: "<strong>You have successfully signed up, Enjoy!</strong>"
          };
          return sgMail.send(msg);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    return res.redirect("/login");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    headTitle: "Reset",
    errorMessage: message,
    isAuthenticated: false
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email not found.");
          return res.redirect("/reset");
        }
        user.tokenReset = token;
        //user.tokenResetExpiration = Date.now + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
        // const SENDGRID_API_KEY =
        //   "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";
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: req.body.email,
          from: "nodeJSPractice@example.com",
          subject: "PASSWORD RESET",
          html: `
        <p>You requested a Password reset</p>
        <p>Click this  <a href = 'http://localhost:3000/reset/${token}'>LINK</a> to reset Password</p>
        `
        };
        return sgMail.send(msg);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ tokenReset: token })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        headTitle: "Update Password",
        path: "/new-password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  let newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({ tokenReset: passwordToken, _id: userId })
    .then((user) => {
      resetUser = user;
      bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      password = hashedPassword;
      tokenReset = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
