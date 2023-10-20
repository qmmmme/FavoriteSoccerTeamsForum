const express = require('express');// for express template
const mainController = require('../controllers/mainControllers'); //for the main controller
const router = express.Router();

//GET / for landing the home page
router.get('/', mainController.home);

//GET /about for landing the about page
router.get('/about', mainController.about);

//GET /contact for landing the contact page
router.get('/contact', mainController.contact);

module.exports = router;
