var utilObj = require(ROOT_PATH + '/library/util');
var helperObj = require(ROOT_PATH + '/library/helper');

module.exports = function(app) {
	/**
	 * REST API Interfaces
	 */
	app.get('/api', function(httpRequest, httpResponse) {
		httpResponse.end('!!!	Welcome to Mopublish REST API	!!!');
	});
	
	app.get('/api/:slug', function(httpRequest, httpResponse) {
		httpResponse.end('Sorry!!! GET is not supproted anymore.');
	});
	
	app.post('/api/create/content', function(httpRequest, httpResponse) {
		var contentObj = require('./library/content');
		contentObj.create({
			type: httpRequest.body.Request.ContentType,
			title: httpRequest.body.Request.Content.Title,
			description: httpRequest.body.Request.Content.Description,
			excerpt: httpRequest.body.Request.Content.Excerpt,
			tags: (httpRequest.body.Request.Content.Tags) ? httpRequest.body.Request.Content.Tags.split(',') : [],
			status: (httpRequest.body.Request.Content.Status) ? httpRequest.body.Request.Content.Status.toUpperCase() : 'DRAFT'
		}, function(contentInfo) {
			console.log(contentList);
			httpRequest.end('OK');
		}, function(errCode) {
			console.log(errCode);
			httpRequest.end('Errro');
		});
	});
	
	app.post('/api/getContents', function(httpRequest, httpResponse) {
		var contentObj = require('./library/content');
		contentObj.getContentList({
			type: httpRequest.body.Request.ContentType
		}, function(contentList) {
			console.log(contentList);
			helperObj.JSONResponse(httpResponse, contentList);
		});
	});
	
	app.post('/api/getTaxonomies', function(httpRequest, httpResponse) {
		httpResponse.end('Sorry!!! GET is not supproted anymore.');
	});
	
	app.post('/api/getTerms', function(httpRequest, httpResponse) {
		httpResponse.end('Sorry!!! GET is not supproted anymore.');
	});
};