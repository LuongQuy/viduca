var express = require('express');
var router = express.Router();

const classroomController = require('../controllers/learner/classroomController');
const authController = require('../controllers/authController');

router.get('/courses', authController.isLogged, classroomController.getCourses);

router.get('/classroom', authController.isLogged, classroomController.getClassroom);

module.exports = router;
