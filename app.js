const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const getError = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const MONGODB_URI =
  "mongodb+srv://Mubby09:RLimmxv9VO7fn0y8@cluster0-mrvec.mongodb.net/shop";
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(flash());

app.set("view engine", "ejs");
app.set("views", "views");

// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//     User.findById(req.session.user._id)
//       .then((user) => {
//         req.user = user;
//         next();
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// });

app.use(adminRoutes);
app.use(shopRouter);
app.use(authRouter);
app.use(getError.error);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("connected!!!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

//You can never send a response and then use next() . Doing that will result in errors.

//UsernameForAdminOnMongoAtlas1: {Mubarak, Password: olamilekan1996}
//UsernameForAdminOnMongoAtlas2: {Mubby09, Password: RLimmxv9VO7fn0y8}
