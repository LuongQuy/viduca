var express = require('express');
var router = express.Router();

const loginController = require('../controllers/loginController');
const signUpController = require('../controllers/signUpController');
const authController = require('../controllers/authController');
/* GET login page. */
router.get('/', authController.notLogged, loginController.getLogin);
router.post('/', loginController.postLogin);

router.get('/sign-up', authController.notLogged, signUpController.getSignUp);
router.post('/sign-up', signUpController.postSignUp);

module.exports = router;
