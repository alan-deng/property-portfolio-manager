require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const mongodbURI = process.env.MONGODBURI;
const session = require("express-session");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");
const User = require("./models/users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
});

//===============Middleware===================
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  req.session.isOnline = true;
  next();
});
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session())

const verifyCallback = (username, password, done) => {
  User.findOne({ login: username })
      .then((user) => {
        if (!user) { return done(null, false, {message: 'Incorrect username'}) }
        const isValid = bcrypt.compareSync(password, user.password)
        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false, {message: 'Incorrect Password'});
        }
      })
      .catch((err) => {   
          done(err);
      });

}
passport.use(
  new LocalStrategy({usernameField: 'login'}, verifyCallback)
);
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(userId, done) {
  User.findById(userId, (err, user) => {
      if (err) { return done(err); }
      done(null, user);
  });
});


app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/", passport.authenticate('local', {failureRedirect: '/'}), (req, res, next) => {
  res.redirect(`/users/${req.session.passport.user}/properties`)
}
);

app.listen(PORT);
