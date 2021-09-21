require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const mongodbURI = process.env.MONGODBURI;
const methodOverride = require("method-override");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const usersRouter = require("./controllers/users");
const flash = require("connect-flash");

//===============Middleware===================
mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
});

const mongoStoreOptions = {
  mongoUrl: mongodbURI,
};
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // expires in 1 day. 1000ms/sec * 60sec/min * 60 min/hr * 24 hr/day
    },
  })
);

app.use((req, res, next) => {
  req.session.isOnline = true;
  next();
});
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//===============Passport config===============
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

//===============Router===============
app.use("/users", usersRouter);

//===============Unauthenticated routes===============
app.get("/", (req, res) => {
  const errors = req.flash().error || [];
  res.render("login.ejs", { errors: errors });
});

app.get("/register", (req, res) => {
  const errors = req.flash().error || [];
  res.render("register.ejs", { errors: errors });
});

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.get("/error", (req, res) => {
  res.render("error.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect(`/users/${req.user._id}/properties`);
  }
);

app.listen(PORT);
