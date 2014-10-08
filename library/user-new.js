var util = require('util');
var events = require('events');

var User = function() {
	events.EventEmitter.call(this);
	
	this.register = function(params) {
		var newUser = {	email: params.email, password: params.password, repassword: params.repassword };
		this.emit('MP:__register', newUser);
	};
	
	var __validate = function(user) {
		this.emit('MP:__register_validated', user);
	};
	
	var __saveUser = function(user) {
		this.emit('MP:__register_saved', user);
	};
	
	var __sendWelcomeEmail = function(user) {
		this.emit('MP:__register_sent_welcome', user);
	};
	
	var __registrationSuccess = function(user) {
		this.emit('MP:REGISTERED', user);
	};
	
	this.on('MP:__register', __validate);
	this.on('MP:__register_validated', __saveUser);
	this.on('MP:__register_saved', __sendWelcomeEmail);
	this.on('MP:__register_sent_welcome', __registrationSuccess);
};

util.inherits(User, events.EventEmitter);
module.exports = new User();