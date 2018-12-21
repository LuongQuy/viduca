var express = require('express');
var router = express.Router();

const classroomController = require('../controllers/teacher/classroomController');
const authController = require('../controllers/authController');

router.get('/courses', authController.isLogged, classroomController.getCourses);

router.post('/create-new-course', authController.isLogged, classroomController.createNewCourse);

router.get('/classroom', authController.isLogged, classroomController.getClassroom);

router.get('/course-management-page', authController.isLogged, classroomController.getCoursesManagementPage);

router.get('/import-learner', authController.isLogged, classroomController.getImportLearnerPage);

router.post('/import-learner', authController.isLogged, classroomController.postImportLearner);

router.get('/add-learner', authController.isLogged, classroomController.getAddLearner);

router.post('/add-learner', authController.isLogged, classroomController.postAddLearner);

router.post('/delete-learner', authController.isLogged, classroomController.postDeleteLearner);

var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage }).single("file");

router.post('/upload-slide', function (req, res) {
    upload(req, res, function (err) {
        var oldPath = './upload/' + req.file.originalname;
        // if(err) return res.send('Error uploading file: ' + err);
        // else res.send('./public/uploads/slides/' + req.file.originalname);
        var newPath = './upload/' + Date.now() + '-' + req.file.originalname;
        var path = 'upload/' + Date.now() + '-' + req.file.originalname;
        fs.rename(oldPath, newPath, err => {
            if (err) return res.end("Error uploading file...");
            res.send(path);
        });
    })
})

router.get('/upload-slide', function(req, res){
    res.render('teacher/upload-file');
})

module.exports = router;
