const courses = require('../../models/course');
const users = require('../../models/user');
const openviduController = require('../openviduController');
// const OpenVidu = require('openvidu-node-client').OpenVidu;
// const OV = new OpenVidu('https://45.77.242.35:4443', 'MY_SECRET');

exports.getCourses = (req, res) => {
    const userId = req.user._id;
    if (req.user.role === 'LEARNER') {
        var username = '';
        if (typeof req.user.info.lastname != 'undefined') { username += req.user.info.lastname; }
        if (typeof req.user.info.firstname != 'undefined') { username += ' ' + req.user.info.firstname; }
        courses.find({ learner: userId }, (err, courses) => {
            res.render('learner/course-list', {
                courses: courses,
                username: username,
                email: req.user.local.email
            });
        })
        // users.findById(req.user._id)
        // .populate('belongCourses')
        // .exec((err, user) => {
        //     res.render('learner/course-list', {
        //         courses: user.belongCourses,
        //         username: username,
        //         email: req.user.local.email
        //     }); 
        // });
    }
    else if (req.user.role === 'TEACHER')
        res.redirect('/teacher/courses');
}

// exports.getClassroom = (req, res) => {
//     var courseId = req.query.courseID;
//     // res.send(courseId);
//     courses.findOne({_id: courseId}, 'session', (err, course) => {
//         // var session = JSON.parse(course.session);
//         var session = OV.resetSessionWithJson(course.session);
//         session.generateToken()
//         .then(token => {
//             res.send(token);
//         }).catch(err => console.log(err));
//     });
// }
exports.getClassroom = openviduController.getClassroom;