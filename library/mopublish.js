//	setup event emitter
var EventEmitter = require('events').EventEmitter;
exports.EventEmitter = new EventEmitter();


//	setup helper classes
exports.helper = require(ROOT_PATH + '/library/helper');


//	setup utility classes
exports.util = require(ROOT_PATH + '/library/util');


//setup template classes
exports.content = require(ROOT_PATH + '/library/content');


//	setup template classes
exports.template = require(ROOT_PATH + '/library/template');