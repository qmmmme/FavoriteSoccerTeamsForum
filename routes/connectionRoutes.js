const express = require('express');// for express template
const connectController = require('../controllers/connectControllers'); //for the connection controllers
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const {validateId, validateConnection} = require('../middlewares/validator');

const router = express.Router();

router.get('/', connectController.index);

// GET /connections/newConnection send a HTML form for creating new connection
router.get('/newConnection', isLoggedIn, connectController.new);

//POST /connections crete a new connection
router.post('/', isLoggedIn, validateConnection, connectController.create);

//GET /connections/:id send a connection identified by id
router.get('/:id', validateId, connectController.show);

//GET /stories/:id/edit send html form for editing an existing connection
router.get('/:id/edit', validateId, isLoggedIn, connectController.edit);

//PUT /connections/:id update the connection identified by id
router.put('/:id', validateId, isLoggedIn, validateConnection, connectController.update);

//DELETE /connections/:id delete the connection identified by id
router.delete('/:id/', validateId, isLoggedIn, connectController.delete);

//POST /connections/:id/rsvp make a decision with a connection from a sepcific user
router.post('/:id/rsvp', validateId, isLoggedIn, validateConnection, connectController.rsvpProcess);

//exports this route module
module.exports = router;