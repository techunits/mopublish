mpObj = require(ROOT_PATH + '/library/mopublish');

module.exports = function(app) {
	/**
	 * add test event for footer
	 */
	app.use(function (httpRequest, httpResponse, next) {
		mpObj.emit('MP:FOOTER', '<center>MPTEST Plugin loaded successfully.</center>');
		
		/**
		 * handle custom post login actions
		 */
		EventEmitter.on('MP:LOGIN', function(userInfo) {
			console.log('Execute: MP:LOGIN');
			console.log(userInfo);
			httpResponse.redirect('/dashboard');
		});
		
		next();
	});
	
    app.get('/mptest', function(httpRequest, httpResponse) {
        httpResponse.end('Welcome to Mopublish test plugin page....');
    });
    
    
    app.get('/mptest/dev', function(httpRequest, httpResponse) {
    	//	emit event to update Opengraph data to custom
    	mpObj.emit('MP:OPENGRAPH', {
    		title: 'Test Opengraph title'
    	});
    	
    	//	emit event to update SEO meta data to custom
    	mpObj.emit('MP:SEOMETA', {
    		title: 'Test META title'
    	});
    	
    	//	emit event to update Opengraph data to custom
    	mpObj.emit('MP:PAGETITLE', 'Test Opengraph Title 123');
    	
        httpResponse.render(ROOT_PATH + '/plugins/mptest/views/test.ejs');
    });
};