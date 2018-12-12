const courses = require('../../models/course');
const users = require('../../models/user');
const openviduController = require('../openviduController');

exports.getCourses = (req, res) => {
    if(req.user.role === 'LEARNER'){
        var username = '';
        if(typeof req.user.info.lastname != 'undefined'){username += req.user.info.lastname;}
        if(typeof req.user.info.firstname != 'undefined'){username += ' ' + req.user.info.firstname;}
        res.render('learner/course-list', {
            courses: req.user.belongCourses,
            username: username,
            email: req.user.local.email
        });
    }
    else if(req.user.role === 'TEACHER')
        res.redirect('/teacher/courses');
}

exports.getClassroom = openviduController.getClassroom;