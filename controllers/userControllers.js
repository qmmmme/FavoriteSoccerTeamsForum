
const User = require('../models/user');
const Connect = require('../models/connection');
const Rsvp = require('../models/rsvp');

exports.index = (req, res) => {
    console.log(req.flash());
    res.render('./user/login');
};
exports.login = (req, res) => {
    console.log(req.flash());
    res.render('./user/login');
};
exports.signup =  (req, res) => {
        res.render('./user/new');
}; 
exports.newUser =  (req, res, next) => {  
    
    let user = new User(req.body);
    if(user.email){
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(() => res.redirect('/users/login'))
    .catch(err => {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }
        if(err.code === 11000){
            req.flash('error', 'Email address has been used');
            return res.redirect('/users/new');
        }
        next(err);
    });
}; 
exports.process =  (req, res, next) => {  
    
    //authenticate user login request
    let email = req.body.email;
    if(email){
        email = email.toLowerCase();
    }
    let password = req.body.password;
    //get the user that matches the email
    User.findOne({email: email})
    .then(user =>{
        if(user){
            //find the user in the DB
            user.comparePassword(password)
            .then(result => {
                if(result) {
                    req.session.user = {id: user._id, firstName: user.firstName, lastName: user.lastName};// store user._id and firstName and lastName in the session 
                    console.log(req.session.user);
                    req.flash('success', 'You have successfully logged in!');
                    res.redirect('./profile');
                }else{
                    //console.log('Wrong password!');
                    req.flash('error', 'Wrong password!')
                    res.redirect('./login');
                }
            })
            .catch(err => next(err));
        } else {
            //console.log("Wrong email address!");
            req.flash('error', 'Wrong email address!')
            res.redirect('./login');
        }
    })
    .catch(err => next(err));
}; 
exports.profile =  (req, res, next) => {  
    let id = req.session.user.id;
    //console.log(req.flash());
    Promise.all([User.findById(id), Connect.find({author: id}), Rsvp.find({user_id: id}).populate('connection_id', 'topic title')]) //Rsvp.find({user_id: id}))
    .then(results => {
        const[user, connects, rsvps] = results;//const[user, connects, rsvp] = results;
        // console.log(user);
        // console.log(connects);
        // console.log(rsvps);
        return res.render('./user/profile', {user, connects, rsvps});//return res.render('./user/profile', {user, connects, rsvp})
    })
    .catch(err => next(err))
}; 
exports.logout = (req, res, next) => { 
    req.session.destroy(err => {
        if(err){
            return next(err);
        }else {
            res.redirect('/users');
        }
    });
} ;

