const courses = require('../../models/course');
const users = require('../../models/user');
const openviduController = require('../openviduController');

var fs = require('fs');

exports.getCourses = (req, res) => {
    courses.find({ instructorId: req.user._id }, (err, courseList) => {
        if (err) res.send('Lỗi tải trang');
        var username = '';
        if (typeof req.user.info.lastname != 'undefined') { username += req.user.info.lastname; }
        if (typeof req.user.info.firstname != 'undefined') { username += ' ' + req.user.info.firstname }

        res.render('teacher/course-list', { courseList: courseList, instructor: username, username: username, email: req.user.local.email });
    });
}
exports.createNewCourse = (req, res) => {
    var course = new courses();
    course.name = req.body.coursename;
    course.description = req.body.description;
    course.instructorId = req.user._id;
    course.instructorName = req.user.info.lastname + ' ' + req.user.info.firstname;
    course.save((err, course) => {
        res.redirect('/teacher/courses');
    });
}

// exports.getClassroom = (req, res) => {
//     var courseId = req.query.courseID;
//     OV.createSession()
//     .then(session => {
//         courses.findOneAndUpdate({_id: courseId}, {
//             session: session
//         }, (err, course) => {
//             session.generateToken()
//             .then(token => {
//                 res.render('teacher/classroom', {
//                     token: token,
//                     username: req.user.info.lastname + ' ' + req.user.info.firstname,
//                     email: req.user.local.email
//                 });
//             })
//             .catch(err => console.log(err));
//         });
//     })
// }

exports.getClassroom = openviduController.getClassroom;

exports.getCoursesManagementPage = (req, res) => {
    var username = '';
    if (typeof req.user.info.lastname != 'undefined') { username += req.user.info.lastname; }
    if (typeof req.user.info.firstname != 'undefined') { username += ' ' + req.user.info.firstname }
    courses.findOne({ _id: req.query.courseID }, '_id name description', (err, course) => {
        if (err) console.log(err);
        else res.render('teacher/course-management-page', { course: course, username: username, email: req.user.local.email });
    });
}

exports.getImportLearnerPage = (req, res) => {
    var username = '';
    var username = '';
    if (typeof req.user.info.lastname != 'undefined') { username += req.user.info.lastname; }
    if (typeof req.user.info.firstname != 'undefined') { username += ' ' + req.user.info.firstname }
    courses.findOne({ _id: req.query.courseID }, '_id name description', (err, course) => {
        if (err) console.log(err);
        else res.render('teacher/import-learner-page', { course: course, username: username, email: req.user.local.email });
    });
}

const csv = require("fast-csv");
const formidable = require('formidable');
var stream;

exports.postImportLearner = (req, res) => {
    var courseID = req.query.courseID;
    var newpath = '';
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '../../../public/files/';
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        newpath = form.uploadDir + Date.now() + '-' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            stream = fs.createReadStream(newpath);

            var learnerID = [];
            courses.findOne({ _id: courseID }, 'learner', (err, course) => {
                learnerID = learnerID.concat(course.learner);
            });

            var learnerEmail = [];
            var csvStream = csv().on("data", data => {
                if (data[0] != '')
                    learnerEmail.push(data[0]);
            }).on("end", () => {
                learnerEmail.forEach(email => {
                    if (email != '') {
                        users.findOne({ 'local.email': email }, '_id belongCourses', (err, user) => {
                            if (user) {
                                var belongCourses = [];
                                belongCourses = belongCourses.concat(user.belongCourses);
                                var checkExistCourse = belongCourses.some(() => {
                                    if(belongCourses == courseID) return true;
                                    else return false;
                                });
                                if (! checkExistCourse) {
                                    courses.findByIdAndUpdate(courseID, { $push: {learner: user._id} }, (err, course) => {
                                        if(err) console.log(err);
                                    });
                                    users.findByIdAndUpdate(user._id , { $push: { belongCourses: courseID }}, (err, user) => {
                                        if(err) console.log(err);
                                    });
                                }
                            } else {
                                var newUser = new users({
                                    local: {
                                        email: email
                                    },
                                    belongCourses: [courseID],
                                    role: 'LEARNER',
                                    status: 'INACTIVE'
                                });
                                newUser.save((err, user) => {
                                    console.log('User 2: ' + user);
                                    courses.findByIdAndUpdate(courseID, { $push: {learner: user._id} }, (err, course) => {
                                        if(err) console.log(err);
                                    });
                                });
                            }
                        });
                    }
                });
            })
            stream.pipe(csvStream);
        });
    });

    res.redirect('/teacher/import-learner?courseID=' + req.query.courseID);
}

exports.getAddLearner = (req, res) => {
    var username = '';
    if (typeof req.user.info.lastname != 'undefined') { username += req.user.info.lastname; }
    if (typeof req.user.info.firstname != 'undefined') { username += ' ' + req.user.info.firstname }
    courses.findOne({ _id: req.query.courseID })
        .populate('learner').exec((err, course) => {
            var username = '';
            if (typeof req.user.info.lastname != 'undefined') { username += req.user.info.lastname; }
            if (typeof req.user.info.firstname != 'undefined') { username += ' ' + req.user.info.firstname }
            res.render('teacher/add-learner', {
                learners: course.learner,
                username: username,
                email: req.user.local.email,
                course: course
            });
        });
}

exports.postAddLearner = (req, res) => {
    var email = req.body.email;
    var courseID = req.query.courseID;
    users.findOne({'local.email': email}, '_id belongCourses', (err, user) => {
        if(user){
            var belongCourses = JSON.stringify(user.belongCourses);
            console.log('belongCourse 1: ' + belongCourses);
            console.log('2 :' + belongCourses);
            if (! belongCourses.includes(courseID)) {
                courses.findByIdAndUpdate(courseID, { $push: {learner: user._id} }, (err, course) => {
                    if(err) console.log(err);
                });
                users.findByIdAndUpdate(user._id , { $push: { belongCourses: courseID }}, (err, user) => {
                    if(err) console.log(err);
                });
            }
            res.redirect('/teacher/add-learner?courseID=' + courseID);
        }else{
            var newUser = new users({
                local: {
                    email: email
                },
                belongCourses: [courseID],
                role: 'LEARNER',
                status: 'INACTIVE'
            });
            newUser.save((err, user) => {
                courses.findByIdAndUpdate(courseID, {$push: {learner: user._id}}, (err, course) => {
                    if(err) console.log(err);
                })
            });
            res.redirect('/teacher/add-learner?courseID=' + courseID);
        }
    });
}

exports.postDeleteLearner = (req, res) => {
    var courseID = req.query.courseID;
    var learnerDelID = req.query.learnerDelID;
    console.log('learner id: '+learnerDelID);
    courses.findById(courseID, '_id instructorId learner', (err, course) => {
        if(course){
            var instructorID = JSON.stringify(course.instructorId);
            var currentUserID = JSON.stringify(req.user._id);
            console.log('typeof instructorid 1: ' + typeof instructorID);
            console.log('typeof instructorid 2: ' + typeof currentUserID);
            if(instructorID === currentUserID){
                console.log(course);
                courses.findByIdAndUpdate(courseID, {$pull: {learner: learnerDelID}}, (err, course) => {
                    if(err) console.log(err);
                    else console.log(course);
                    res.redirect('/teacher/add-learner?courseID=' + courseID);  
                })
            }  
        }
    });
}