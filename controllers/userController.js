const users = require('../models/user');

exports.getProfile = (req, res) => {
    var username = '';
    if(typeof req.user.info.firstname != 'undefined') username += req.user.info.firstname;
    if(typeof req.user.info.lastname != 'undefined') username += ' ' + req.user.info.lastname;
    res.render('profile', {
        firstname: req.user.info.firstname,
        lastname: req.user.info.lastname,
        location: req.user.info.location,
        phone: req.user.info.phone,
        username: username
    });
}

exports.postChangeInformation = (req, res) => {
    var user = users.findOneAndUpdate({_id: req.user._id}, {
        info: {
            firstname: req.body.first_name,
            lastname: req.body.last_name,
            phone: req.body.phone,
            location: req.body.location
        }
    }, {new: true}, (err, doc) => {
        if(err) console.log(err);
        // console.log(doc);
    });
    res.redirect('/user/profile');
}

exports.postChangePassword = (req, res) => {
    if(req.body.currentPassword === req.user.local.password){
        if(req.body.newPassword === req.body.confirmNewPassword){
            users.findOneAndUpdate({_id: req.user._id}, {
                local: {
                    password: req.body.newPassword
                }
            }, (err, user) => {});
        }
    }
    res.redirect('/user/profile');
}