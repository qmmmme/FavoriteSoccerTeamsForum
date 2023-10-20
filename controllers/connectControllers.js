const model = require('../models/connection');
const Rsvp = require('../models/rsvp');
// const User = require('../models/user');
const { DateTime } = require("luxon");//for managing date and time
//this method help to sort the connections array
exports.sorted = (connects) => {
    let newConnects = [];
    let x = connects.length;
    while(x > 0) {
        //find all connections has the same topic
        let category = connects.filter(connect => connect.topic === connects[0].topic);
        //push the above array to the new connections array
        newConnects.push(category);
        // update the remaining connections
        connects = connects.filter(connect => connect.topic !== connects[0].topic);
        x = connects.length;
       
    }
    return newConnects;
};
exports.index = (req, res, next) => {
    model.find()
    .then(connects => {
       //sorted the connections array into the new one
        let newConnects = this.sorted(connects);
        res.render('./connection/connections', {newConnects});
    })
    .catch(err => next(err));
};
// GET /connections/newConnection: send a HTML form for creating new connection
exports.new = (req, res) => {
    res.render("./connection/newConnection");
};
//POST /connections: crete a new connection
exports.create =  (req, res, next) => {
    
    let connect = new model(req.body);
    connect.author = req.session.user.id;
    console.log(connect);
    connect.save()
    .then(connect => {
        res.redirect('/connections');
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err)
    });
    
};
//GET /connections/:id send a connection identified by id
exports.show = (req, res, next) => {
    let id = req.params.id;
    Promise.all([model.findById(id).populate('author', 'firstName lastName'), Rsvp.find({connection_id: id, decision: 'YES'})])
    .then(results => {
        const [nconnect, rsvps] = results;
        if(nconnect) {
            let firstConnect = {...nconnect};//create a copy of the founded object
            let connect = firstConnect._doc;// the copying document to be render
            console.log(rsvps);
            //then, change the date format
            connect.date = DateTime.fromISO(connect.date).toLocaleString(DateTime.DATE_MED);
            console.log(connect.date);
            console.log(connect);
            res.render('./connection/connection', {connect, rsvps});
        }else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }   
    })
    .catch(err => next(err));
    
};
//GET /connections/:id/edit: send html form for editing an existing connection
exports.edit = (req, res, next) => {
    let id = req.params.id;
    
    model.findById(id)
    .then(connect => {
        res.render('./connection/edit', {connect});
    })
    .catch(err => next(err));
};
//PUT /connections/:id update the connection identified by id
exports.update =  (req, res, next) => {
    let connect = req.body;
    let id = req.params.id;
    
    model.findByIdAndUpdate(id, connect, {useFindAndModify: false, runValidators: true})
    .then(connect => {
       res.redirect('/connections/' + id);
       
    })
    .catch(err => {
        if(err.name == 'ValidationError'){
            err.status = 400;
        }
        next(err)}
    );

};
//DELETE /stories/:id delete the connection identified by id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    //delete from connections collection
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connect => {
        //delete from rsvps collection
        Rsvp.deleteMany({connection_id: connect.id})
        .then(()=> res.redirect('/connections'))
        .catch(err => {
            if(err.name == 'ValidationError'){
                err.status = 400;
            }
            next(err)}
        );    
    })
    .catch(err => {
        if(err.name == 'ValidationError'){
            err.status = 400;
        }
        next(err)}
    );
    

};
//POST /connections/:id/rsvp make a decision with a connection from a sepcific user by id
exports.rsvpProcess = (req, res, next) => {

    let id = req.params.id;
    console.log(req.params.id);
    user = req.session.user;
    model.findById(id)
    .then(connect => {
        if(connect.author == user.id){
            err = new Error("The host user cannot uses the RSVP function");
            err.status = 401;
            next(err);
        }else {
            let rsvp = new Rsvp();
            rsvp.connection_id = id;
            rsvp.user_id = req.session.user.id;
            //console.log(req.body.decision);
            rsvp.decision = req.body.decision.toUpperCase();
            //console.log(rsvp);
            Rsvp.findOneAndUpdate({connection_id: rsvp.connection_id, user_id: rsvp.user_id}, {decision: rsvp.decision}, {upsert: true})
            .then(rsvp => {
                console.log(rsvp);
                req.flash('success', 'Successfully update your RSVP for this connection!');
                res.redirect('http://localhost:3003/users/profile');
            })
            .catch(err => {
                if(err.name == 'ValidationError'){
                    err.status = 400;
                    next(err);
                }
            })
            
        };
    }) 
    .catch(err => next(err));            
            
   
};
