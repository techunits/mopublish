var util = require('util');
var events = require('events');

var CMSHandler = function() {
	events.EventEmitter.call(this);
	var contentValidator = new require(ROOT_PATH + '/library/validator');
	
	/**
	 * trigger the cms type identification
	 */
	this.triggerPage = function(urlParts) {
		var triggerEvnt = this;
		contentValidator.isTaxonomy(urlParts[0], function(taxInfo) {
			triggerEvnt.emit('MP:_TYPE_TAXONOMY', taxInfo);
		}, function() {
			triggerEvnt.emit('MP:__CHECK_PAGE', urlParts);
		});
	};
	
	
	/**
	 * method to check whether current url is a page
	 */
	var __checkPage = function(urlParts) {
		var triggerEvnt = this;
		contentValidator.isPage(urlParts[0], function(pageInfo) {
			triggerEvnt.emit('MP:_TYPE_PAGE', pageInfo);
		}, function() {
			triggerEvnt.emit('MP:__CHECK_CONTENT_TYPE', urlParts);
		});
	};
	
	
	/**
	 * check whether current url is a content type
	 */
	var __checkContentType = function(urlParts) {
		var triggerEvnt = this;
		contentValidator.isContentType(urlParts[0], function(contentTypeInfo) {
			//	if content type archive requested
			if(1 == urlParts.length) {
				triggerEvnt.emit('MP:_TYPE_CONTENT_ARCHIVE', contentTypeInfo);
			}
			
			//	if single content requested
			else {
				triggerEvnt.emit('MP:__CHECK_CONTENT_SINGLE', urlParts);
			}
		}, function() {
			triggerEvnt.emit('MP:_TYPE_404', null);
		});
	};
	
	
	/**
	 * check whether current url is a single content view
	 */
	var __checkContentSingle = function(urlParts) {
		var triggerEvnt = this;
		require(ROOT_PATH + '/library/content').getContentBy('slug', urlParts[1], urlParts[0], function(contentInfo) {
			triggerEvnt.emit('MP:_TYPE_CONTENT_SINGLE', contentInfo);
		}, function() {
			triggerEvnt.emit('MP:_TYPE_404', null);
		});
	};
	
	this.on('MP:__CHECK_PAGE', __checkPage);
	this.on('MP:__CHECK_CONTENT_TYPE', __checkContentType);
	this.on('MP:__CHECK_CONTENT_SINGLE', __checkContentSingle);
};

util.inherits(CMSHandler, events.EventEmitter);
module.exports = new CMSHandler();