const passport = require('passport');
const localStrategy = require('passport-local');
const users = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    users.findById(id, (err, user) => {
        return done(null, user);
    })
});

passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    users.findOne({'local.email': email, 'local.password': password}, (err, user) => {
        if(user) {
            return done(null, user);
        }
        return (err, null);
    });
}));

exports.getLogin = (req, res) => {
    res.render('index');
}
exports.postLogin = passport.authenticate('local.login', {
    successRedirect: '/learner/courses',
    failureRedirect: '/'
});