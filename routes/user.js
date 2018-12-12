var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/profile', authController.isLogged, userController.getProfile);
router.post('/profile/change-information', authController.isLogged, userController.postChangeInformation);
router.post('/profile/change-password', authController.isLogged, userController.postChangePassword);

module.exports = router;
