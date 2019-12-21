const bcrypt = require("bcryptjs");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

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
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
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
        return res.redirect("login");
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
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists!");
        return res.redirect("/signup");
      }
      bcrypt /////
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
          return transporter.sendMail({
            to: email,
            from: "nodeJsProject@me.com",
            subject: "Sign Up successful",
            html: "<h1>You have successfully signed up, Enjoy!</h2>"
          });
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
        user.tokenResetExpiration = Date.now + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "nodeJsProject@me.com",
          subject: "PASSWORD RESET",
          html: `
          <p>You requested a password reset</p>
          <p>Click this  <a href = 'http://localhost:3000/reset/${token}'>LINK</a>to reset Password</p>
          `
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// "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"
// "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" (First sendgrid API key)
