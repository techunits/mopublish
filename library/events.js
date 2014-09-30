module.exports = function(httpRequest, httpResponse) {
	/**
	 * add conditional stylesheets
	 */
	mpObj.EventEmitter.on("stylesheet", function(stylesheetList) {
		var stylesheets = httpResponse.locals.stylesheets;
		
		stylesheetList.forEach(function(fileInfo) {
			stylesheets += '<link rel="stylesheet" type="text/css" href="'+fileInfo.file+'" />';
		});
	});
	
	/**
	 * add conditional javascripts
	 */
	mpObj.EventEmitter.on("script", function(scriptList) {						
		scriptList.forEach(function(fileInfo) {
			scripts += '<script type="text/javascript" src="'+fileInfo.file+'"></script>';
		});
	});
	
	
	/**
	 * add opengraph data to template vars
	 */
	mpObj.EventEmitter.on("seometa", function(seometaData) {
		if(seometaData) {
			httpResponse.locals.seometa = require(ROOT_PATH + '/library/template').getSeoMetaHTML(seometaData);
		}
	});
	
	/**
	 * add mpHeader data to template vars
	 */
	mpObj.EventEmitter.on("mpHeader", function(seometaData) {
		//	in process
	});
	
	/**
	 * add mpFooter data to template vars
	 */
	mpObj.EventEmitter.on("mpFooter", function(seometaData) {
		//	in process
	});
};