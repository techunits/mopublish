var util = require('util');
var events = require('events');

//	setup event emitter
var MP = function() {
	//	events.EventEmitter.call(this);
		
	this.content = require(ROOT_PATH + '/library/content');
	
	this.helper = require(ROOT_PATH + '/library/helper');
	
	this.template = require(ROOT_PATH + '/library/template');
};
util.inherits(MP, events.EventEmitter);
module.exports = new MP();