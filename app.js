const path = require("path");
const express = require("express");
const app = express();
const getError = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const bodyParser = require("body-parser");
const mongoConnect = require('./util/database').mongoConnect;

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(adminRoutes);
app.use(shopRouter);
app.use(express.static(path.join(__dirname, "public")));

app.use(getError.error);



mongoConnect(() => { 
    app.listen(3000); 
});

//You can never send a response and then use next() . Doing that will result in errors.
