// dependencies
var express = require('express');
var router = express.Router();

// add db & model dependencies
var mongoose = require('mongoose');
var Dealer = require('../models/dealer');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/message');
}


//GET /dealership - show dealership listing */
router.get('/dealership', isAuthenticated, function (req, res, next) {

    // retrieve all dealership using the dealer model
    Dealer.find(function (err, dealership) {
        // if there is an error
        if (err) {
            res.render('error', { error: err });
        }
        else {
            //if there is no error, show the views/dealership.jade and pass the query results to that view
            res.render('dealership', { dealership: dealership });
            console.log(dealership);
        }
    });
});

// GET /dealership/edit/:id - show single dealer edit form 
router.get('/dealership/edit/:id', function (req, res, next) {
    //store the id from the url in a variable
    var id = req.params.id;

    //use the dealer model to look up the dealer with this id    
    Dealer.findById(id, function (err, dealer) {
        if (err) {
            res.send('Dealer' + id + ' not found');
        }
        else {
            res.render('edit', { dealer: dealer });
        }
    });
});

// POST /dealership/edit/:id - update selected dealer */
router.post('/dealership/edit/:id', function (req, res, next) {
    var id = req.body.id;

    var dealer = {
        _id: req.body.id,
        company: req.body.company,
        address: req.body.address,
        city: req.body.city,
		province: req.body.province,
		postal: req.body.postal,
		phone: req.body.phone
		
    };

    Dealer.update({ _id: id}, dealer, function(err) {
        if (err) {
            res.send('Dealer' + req.body.id + ' not updated. Error: ' + err);
        }
        else {
            res.statusCode = 302;
            res.setHeader('Location', 'http://' + req.headers['host'] + '/dealership');
            res.end();
        }
    });
});

// GET /dealership/add - show dealership input form
router.get('/dealership/add', isAuthenticated, function (req, res, next) {
    res.render('add');
});

// POST /dealership/add - save new dealer
router.post('/dealership/add', function (req, res, next) {

    // use the Dealer model to insert a new dealer
    Dealer.create({
        company: req.body.company,
        address: req.body.address,
        city: req.body.city,
		province: req.body.province,
		postal: req.body.postal,
		phone: req.body.phone
		
    }, function (err, Dealer) {
        if (err) {
            console.log(err);
            res.render('error', { error: err }) ;
        }
        else {
            console.log('Dealer saved ' + Dealer);
            res.render('added', { dealer: Dealer.company });
        }
    });
});
  
// GET dealer delete request    
router.get('/dealership/delete/:id', function (req, res, next) {
    //store the id from the url into a variable
    var id = req.params.id;

    //use our dealer model to delete
    Dealer.remove({ _id: id }, function (err, dealer) {
        if (err) {
            res.send('Dealer' + id + ' not found');
        }
        else {
            res.statusCode = 302;
            res.setHeader('Location', 'http://' + req.headers['host'] + '/dealership');
            res.end();
        }
    });
});

// API GET all the dealership from the database
router.get('/api/dealership', function (req, res, next) {
    Dealer.find(function (err, dealership) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(dealership);
        }
    });
});


//API GET a dealership request by dealership name
router.get('/api/dealership/:id', function (req, res, next) {
    //store the id from the url in a variable
    var id = req.params.id;

    //use the dealer model to look up the dealer with this id    
    Dealer.findById(id, function (err, dealer) {
        if (err) {
            res.send('Dealer' + id + ' not found');
        }
        else {
            res.send({ dealer: dealer });
        }
    });
});


// make controller public
module.exports = router;
