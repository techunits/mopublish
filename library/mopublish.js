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


//setup template classes
exports.content = require(ROOT_PATH + '/library/content');


//	setup template classes
exports.template = require(ROOT_PATH + '/library/template');