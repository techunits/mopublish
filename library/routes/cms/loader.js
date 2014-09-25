var url = require('url');
var utilObj = require(ROOT_PATH + '/library/util');
var helperObj = require(ROOT_PATH + '/library/helper');

module.exports = function(app) {	
	app.get('/', function(httpRequest, httpResponse) {
		//	httpResponse.end('home');
		httpResponse.render('home');
	});
	
	/**
	 * 404 page handler
	 */
	app.get('/404', function(httpRequest, httpResponse) {
		httpResponse.end('404 Page...');
		//	httpResponse.render('index');
	});
};