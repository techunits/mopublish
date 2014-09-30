mpObj = new require(ROOT_PATH + '/library/mopublish');

module.exports = function(app) {
	
	/**
	 * add opengraph data for content
	 */
	mpObj.EventEmitter.on("mp:single", function(contentInfo) {
		mpObj.EventEmitter.emit("mp:opengraph", contentInfo.opengraph);
		mpObj.EventEmitter.emit("mp:seometa", contentInfo.meta);
	});
	
    app.get('/mptest', function(httpRequest, httpResponse) {
        httpResponse.end('Welcome to Mopublish test plugin page....');
    });
    
    
    app.get('/mptest/dev', function(httpRequest, httpResponse) {
    	//	emit event to update Opengraph data to custom
    	mpObj.EventEmitter.emit("mp:opengraph", {
    		title: 'Test Opengraph title'
    	});
    	
    	//	emit event to update SEO meta data to custom
    	mpObj.EventEmitter.emit("mp:seometa", {
    		title: 'Test META title'
    	});
    	
    	//	emit event to update Opengraph data to custom
    	mpObj.EventEmitter.emit("mp:pagetitle", 'Test Opengraph title 123');
    	
        httpResponse.render(ROOT_PATH + '/plugins/mptest/views/test.ejs');
    });
};