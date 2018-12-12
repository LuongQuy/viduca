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

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    users.findOne({'local.email': email}, (err, user) => {
        // if(user) {
        //     return done(null, false);
        // }
        if(user && typeof user.local.password == 'undefined'){
            users.findOneAndUpdate({'local.email': email}, 
            {
                local: {
                    email: email,
                    password: password
                },
                role: 'LEARNER',
                status: 'ACTIVE'
            }, (err, newUser) => {
                if(err) return done(err);
                else return done(null, newUser);
            });
        }else{
            return done(null, false);
        }
    });
}));

exports.getSignUp = (req, res) => {
    res.render('signup');
}
exports.postSignUp = passport.authenticate('local.signup', {
    successRedirect: '/learner/courses',
    failureRedirect: '/sign-up'
});