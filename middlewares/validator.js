const {body} = require('express-validator');
const {validationResult} = require('express-validator');
//checks if the route parameter is a valid ObjectId type value
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
}
exports.validateSignUp = [body('firstName', 'First name cannot be empty!').notEmpty().trim().escape(), 
body('lastName', 'Last name cannot be empty!').notEmpty().trim().escape(),
body('email', "Email must be a valid email address").isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', "Email must be a valid email address").isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back'); //redirect the user to previous page
    } else {
        return next();
    }
}
exports.validateConnection = [body('topic', 'Topic cannot be empty!').notEmpty().trim().escape(), 
body('title', 'Title cannot be empty!').notEmpty().trim().escape(), 
body('detail', 'Detail cannot be empty!').isLength({min: 10}).trim().escape(),
body('locate', 'Location cannot be empty!').isLength({min: 10}).trim().escape(),
body('image', 'Image cannot be empty!').isLength({min: 10}).trim().escape()];