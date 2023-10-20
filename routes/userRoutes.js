const express = require('express');
const userController = require('../controllers/userControllers');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignUp, validateLogIn, validateResult} = require('../middlewares/validator');


const router = express.Router();

router.get('/', userController.index);
//get the login page
router.get('/login', isGuest, userController.login);

//progress login process
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, userController.process);

//get the sign up form

router.get('/new', isGuest, userController.signup);

//POST /users: create a new user

router.post('/', isGuest, validateSignUp, validateResult, userController.newUser);

//GET /users/profile: get the logged in user profile
router.get('/profile', isLoggedIn, userController.profile);

//get the logout page

router.get('/logout', isLoggedIn, userController.logout);

module.exports = router;