const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const methodOverride = require("method-override");
const app = express();
const cors = require("cors");

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

//------------- Initialising passport ----------------

app.use(
  require("express-session")({
    secret: "This the secret message for authentication",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/", (req, res) => {
  res.render("home");
});

//------------------------   Authentication Routes  -------------------------

app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/signup", function (req, res) {
  res.render("signup");
});

app.post("/signup", function (req, res) {
  User.register(
    new User({
      username: req.body.username,
      name: req.body.name,
      phone: req.body.phone,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  );
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/");
  }
);
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// ------------------------ Authentication Ends ------------------------------