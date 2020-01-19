const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const get404 = require("./controllers/get404");
const get500 = require("./controllers/get500");
const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const bodyParser = require("body-parser");
const multer = require("multer"); //For parsing files from the request body
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const csrf = require("csurf");
const User = require("./models/user");
require("dotenv").config();

//console.log(process.env);

app.set("view engine", "ejs");
app.set("views", "views");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "photos");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const MONGODB_URI = process.env.MONGODB_CREDENTIALS;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

const csrfProtection = csrf();

app.use(bodyParser.urlencoded({ extended: false }));
//, fileFilter: fileFilter
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/photos", express.static(path.join(__dirname, "photos")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.loggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(new Error(err));
    });
});

app.use(adminRoutes);
app.use(shopRouter);
app.use(authRouter);
app.use(get500.get500);
app.use(get404.get404);

app.use = (error, req, res, next) => {
  res.redirect("/500");
  // res.status(500).render("500", {
  //   headTitle: "Something Went Wrong",
  //   path: "/500",
  //   isAuthenticated: req.session.loggedIn
  // });
};

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // console.log("connected!!!");
    // app.listen(process.env.PORT || 3000);
    var server = app.listen(process.env.PORT || 3000, function() {
      var port = server.address().port;
      console.log("Express is working on port " + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//You can never send a response and then use next() . Doing that will result in errors.
