var express = require('express');

module.exports = (function() {
    'use strict';
    var api = express.Router();
    
    api.get('/mp-manager', function(httpRequest, httpResponse) {
		if(true === httpRequest.session.loggedin) {
			api.set('views', __dirname + '/mp-manager/views');
			api.set('layout', __dirname + '/mp-manager/views/layout.ejs');
		
			httpResponse.render('dashboard');
		}
		else {
			httpResponse.redirect('/mp-manager/login?msgcode=SESSION_TIMEOUT');
		}
	});
	
	/**
	 * Account Register
	 */
    api.get('/mp-manager/register', function(httpRequest, httpResponse) {
    	api.set('views', __dirname + '/mp-manager/views');
    	api.set('layout', __dirname + '/mp-manager/views/layout.ejs');
		
		httpResponse.render('register');
	}).post('/mp-manager/register', function(httpRequest, httpResponse) {
		var userObj = require('./library/user');
		userObj.signin({
			email: httpRequest.body.email,
			password: httpRequest.body.password
		}, function(userInfo) {
			httpRequest.session.loggedin = true;
			httpRequest.session.userId = userInfo._id;
			httpResponse.redirect('/mp-manager');
		}, function(err) {
			httpResponse.redirect('/mp-manager/login?msgcode=INVALID_CREDENTIAL');
		});
		
	});
	
	
	/**
	 * Account Login
	 */
    api.get('/mp-manager/login', function(httpRequest, httpResponse) {
    	api.set('views', __dirname + '/mp-manager/views');
    	api.set('layout', __dirname + '/mp-manager/views/layout.ejs');
		
		httpResponse.render('login');
	}).post('/mp-manager/login', function(httpRequest, httpResponse) {
		var userObj = require('./library/user');
		userObj.signin({
			email: httpRequest.body.email,
			password: httpRequest.body.password
		}, function(userInfo) {
			httpRequest.session.loggedin = true;
			httpRequest.session.userId = userInfo._id;
			httpResponse.redirect('/mp-manager');
		}, function(err) {
			httpResponse.redirect('/mp-manager/login?msgcode=INVALID_CREDENTIAL');
		});
	});
	
	
	/**
	 * Forgot password
	 */
    api.get('/mp-manager/login/lost-password', function(httpRequest, httpResponse) {
    	api.set('views', __dirname + '/mp-manager/views');
    	api.set('layout', __dirname + '/mp-manager/views/layout.ejs');
		
		httpResponse.render('lost-password');
	}).post('/mp-manager/login/lost-password', function(httpRequest, httpResponse) {
		var userObj = require('./library/user');
		userObj.signin({
			email: httpRequest.body.email,
			password: httpRequest.body.password
		}, function(userInfo) {
			httpRequest.session.loggedin = true;
			httpRequest.session.userId = userInfo._id;
			httpResponse.redirect('/mp-manager');
		}, function(err) {
			httpResponse.redirect('/mp-manager/login?msgcode=INVALID_EMAIL');
		});
	});
	
	/**
	 * Super Admin Logout
	 */
    api.get('/mp-manager/logout', function(httpRequest, httpResponse) {
		httpRequest.session.destroy();
		httpResponse.redirect('/mp-manager/login');
	});
	
    api.get('/mp-manager/settings', function(httpRequest, httpResponse) {
		httpResponse.render('settings');
	});
    
    return api;
})();