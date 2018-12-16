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
        if(user) {
            if(typeof user.local.password != 'undefined') return done(null, false);
            else{
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
            }
        }else{
            let newUser = new users({
                local: {
                    email: email,
                    password: password
                },
                role: 'LEARNER',
                status: 'ACTIVE'
            });
            newUser.save((err, newUser) => {
                return done(null, newUser);
            });
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