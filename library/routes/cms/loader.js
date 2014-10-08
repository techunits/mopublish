module.exports = function(app) {	
	app.get('/', function(httpRequest, httpResponse) {
		//	httpResponse.end('home');
		httpResponse.render('home');
	});
	
	/**
	 * 404 page handler
	 */
	app.get('/404', function(httpRequest, httpResponse) {
		httpResponse.render('404', function(err, html) {
			if(err)
				console.log(err);
			
			httpResponse.end(html);
		});
	});
};