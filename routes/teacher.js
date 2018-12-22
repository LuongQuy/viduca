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

module.exports = router;
