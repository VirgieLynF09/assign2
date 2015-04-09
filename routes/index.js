//from the tutorial Authenticating Node.js Applications With Passport by Agraj Mangal
//http://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619

var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the message page
	res.redirect('/message');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
		res.render('index');
	});
	
	/* GET login page. */
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		//if login is sucessful redirect to the dealership page
		successRedirect: '/dealership',
		//if not redirect to the login page
		failureRedirect: '/login',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		//if the user is unique create registration and redirect to login 
		successRedirect: '/login',
		//if not redirect to signup page and try to register again
		failureRedirect: '/signup',
		failureFlash : true  
	}));


	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}


