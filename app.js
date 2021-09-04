const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
const app = express();

mongoose.connect(
  "mongodb+srv://shankhanil007:12345@cluster0.azmz3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const server = app.listen(process.env.PORT || 3000, () =>
  console.log(`Server has started.`)
);

app.get("/", (req, res) => {
  res.render("home");
});
