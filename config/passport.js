const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/users");

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
