require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const mongodbURI = process.env.MONGODBURI;
const methodOverride = require("method-override");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./models/users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require('connect-mongo')
const bcrypt = require("bcrypt");
const usersRouter = require("./controllers/users");

//===============Middleware===================
mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
});

const mongoStoreOptions = { 
  mongoUrl: mongodbURI
}

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // expires in 1 day. 1000ms/sec * 60sec/min * 60 min/hr * 24 hr/day
    }
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


//passport config
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
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((userId, done) => {
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

//logout. deletes req.session.passport.user.
app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
})

app.post("/login", passport.authenticate('local', {failureRedirect: '/'}), (req, res, next) => {
  res.redirect(`/users/${req.user._id}/properties`)
}
);

app.listen(PORT);
