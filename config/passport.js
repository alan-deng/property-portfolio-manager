const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/users");

const verifyCallback = (username, password, done) => {
  User.findOne({ login: username })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect Password" });
      }
    })
    .catch((err) => {
      done(err);
    });
};
passport.use(new LocalStrategy({ usernameField: "login" }, verifyCallback));
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.clientID,
//       clientSecret: process.env.clientSecret,
//       callbackURL: "/auth/google/redirect",
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((userId, done) => {
  User.findById(userId, (err, user) => {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});
