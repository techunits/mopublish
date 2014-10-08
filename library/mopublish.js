<<<<<<< HEAD
var util = require('util');
var events = require('events');
=======
//	setup event emitter
var EventEmitter = require('events').EventEmitter;
var e = new EventEmitter();
exports.EventEmitter = e;
global.EventEmitter = e;
require('events').EventEmitter.prototype._maxListeners = 100;

//	setup helper classes
exports.helper = require(ROOT_PATH + '/library/helper');


//	setup utility classes
exports.util = require(ROOT_PATH + '/library/util');
>>>>>>> feature/user

//	setup event emitter
var MP = function() {
	events.EventEmitter.call(this);
		
	this.content = require(ROOT_PATH + '/library/content');
	
	this.helper = require(ROOT_PATH + '/library/helper');
	
	this.template = require(ROOT_PATH + '/library/template');
};
util.inherits(MP, events.EventEmitter);
module.exports = new MP();
