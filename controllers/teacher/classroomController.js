const courses = require('../../models/course');
const users = require('../../models/user');
const openviduController = require('../openviduController');

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
    course.save();
    res.redirect('/teacher/courses');
}

exports.getClassroom = openviduController.getClassroom;

exports.getCoursesManagementPage = (req, res) => {
    var username = '';
    if (typeof req.user.info.lastname != 'undefined') { username += req.user.info.lastname; }
    if (typeof req.user.info.firstname != 'undefined') { username += ' ' + req.user.info.firstname }
    courses.findOne({ _id: req.query.courseID }, '_id name description', (err, course) => {
        if (err) console.log(err);
        else res.render('teacher/course-management-page', { course: course, username: username, email: req.user.local.email });
    })
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
const fs = require('fs');
const formidable = require('formidable');
var stream;

exports.postImportLearner = (req, res) => {
    var newpath = '';
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '../../../public/files/';
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        newpath = form.uploadDir + Date.now() + '-' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            stream = fs.createReadStream(newpath);
            var username = [];
            course = courses.findOne({ _id: req.query.courseID }, 'learner', (err, course) => {
                username = username.concat(course.learner);
            });
            var csvStream = csv().on("data", data => {
                if (!username.includes(data[0]) && data[0] != '')
                    username.push(data[0]);
            }).on("end", () => {
                courses.findOneAndUpdate({ _id: req.query.courseID, instructorId: req.user._id }, {
                    learner: username
                }, (err, course) => {
                    username.forEach(email => {
                        if (email != '') {
                            users.findOne({ local: { email: email } }, '_id belongCourses', (err, user) => {
                                if (user == null) {
                                    let belongCourses = [];
                                    let courseObj = {
                                        courseId: req.query.courseID,
                                        courseName: course.name,
                                        courseDescription: course.description,
                                        instructorId: course.instructorId,
                                        instructorName: course.instructorName
                                    }
                                    belongCourses.push(courseObj);
                                    newUser = new users();
                                    newUser.local.email = email;
                                    newUser.belongCourses = belongCourses;
                                    newUser.save();
                                } else {
                                    let belongCourses = [];
                                    belongCourses = user.belongCourses;
                                    let courseObj = {
                                        courseId: req.query.courseID,
                                        courseName: course.name,
                                        courseDescription: course.description,
                                        instructorId: course.instructorId,
                                        instructorName: course.instructorName
                                    }
                                    belongCourses.push(courseObj);
                                    users.findOneAndUpdate({ _id: user._id }, {
                                        belongCourses: belongCourses
                                    });
                                }
                            });
                        }
                    });
                });
            })
            stream.pipe(csvStream);
        });
    });

    res.redirect('/teacher/import-learner?courseID=' + req.query.courseID);
}