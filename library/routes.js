var fs = require('fs');
var appConfigObj = require(ROOT_PATH + '/library/config').loadConfig();
var utilObj = require(ROOT_PATH + '/library/util');
var helperObj = require(ROOT_PATH + '/library/helper');

module.exports = function(app, express) {
	//	define static paths
	app.use('/favicon.ico', express.static(ROOT_PATH + '/public'));
	app.use('/assets', express.static(ROOT_PATH + appConfigObj.theme.path + '/public'));
	app.use('/mp-manager', express.static(ROOT_PATH + '/mp-manager/assets'));
	app.use('/media', express.static(ROOT_PATH + '/' + appConfigObj.uploads.path));
	
	/**
	 * load global values & configurations
	 */
	app.use(function (httpRequest, httpResponse, next) {
		if(-1 != httpRequest.url.indexOf('/mp-manager')) {
			app.set('views', ROOT_PATH + '/mp-manager/views');
			app.set('layout', ROOT_PATH + '/mp-manager/views/layout.ejs');
		}
		
		//	check whether system is installed and set the global parameter.
		if('/mp-manager/installer' != httpRequest.url) {
			utilObj.isSystemInstalled(function() {
				app.set('installed', true);
				httpResponse.locals = {
					httpReq: httpRequest,
					mpObj: {
						util: utilObj,
						helper: helperObj
					},
					globalLocals: {
						siteTitle: 'Mopublish - Innovative & Flexible NodeJS CMS',
						welcomeMessage: 'Welcome back!!!',
						isLoggedin: httpRequest.session.loggedin
					}
			    };
			    next();
			},
			function() {
					app.set('installed', false);
					console.log('Sorry! No valid installation found...');
					httpResponse.redirect('/mp-manager/installer');
			});
		}
		else {
			httpResponse.locals = {
				globalLocals: {
					siteTitle: 'Welcome to Mopublish - Innovative & Flexible NodeJS CMS',
					isLoggedin: httpRequest.session.loggedin
				}
		    };
			next();
		}
	});
	
	/**
     * dynamic route handlers: core
     */
    fs.readdirSync(ROOT_PATH + '/library/routes').forEach(function(coreDirectory) {
		var route = ROOT_PATH + '/library/routes/' + coreDirectory + '/loader.js';
		if(fs.existsSync(route)) {
			console.log('Loading Routes: ' + route);
			require(route)(app);
    	}
    });
	
	/**
     * dynamic route handlers: plugins
     */
    fs.readdirSync(ROOT_PATH + '/plugins').forEach(function(pluginDir) {
        var route = ROOT_PATH + '/plugins/' + pluginDir + '/loader.js';
        if(fs.existsSync(route)) {
        	console.log('Loading Routes: ' + route);
        	require(route)(app);
        }
    });
    
    /**
	 * Rest of the dynamic CMS page handler
	 */
	app.get('/*', function(httpRequest, httpResponse) {
		var urlParsedObj = url.parse(httpRequest.url, true);
		var urlParts = [];
		urlParsedObj.pathname.split('/').map(function(val) {
			if('' != val) {
				urlParts.push(val);
			}
		});
		
		var contentValidator = require(ROOT_PATH + '/library/validator');
		/**
		  *	Check whether SLUG is a TAXONOMY.
		 */
		contentValidator.isTaxonomy(urlParts[0], function(taxInfo) {
			//	TRUE
			httpResponse.render('taxonomy', {
				info: taxInfo
			});
		}, function() {
			
			/**
			  *	Check whether SLUG is a PAGE.
			 */
			contentValidator.isPage(urlParts[0], 
				function(itemInfo) {
					httpResponse.render('page', {
						info: itemInfo
					});
				}, 
				function() {
					/**
					  *	Check whether SLUG is a content type.
					 */
					contentValidator.isContentType(urlParts[0], 
						function(typeInfo) {
							var contentObj = require(ROOT_PATH + '/library/content');
							
							//	check whether Content type archive requested
							if(1 == urlParts.length) {
								contentObj.getContentList({
									type: urlParts[0]
								}, function(contentList) {
									httpResponse.render('archive', {
										info: {
											title: typeInfo.title,
											description: typeInfo.description
										},
										contents: contentList,
										utilObj: utilObj
									}, function(err, html) {
										if(err)
											console.log(err);
										httpResponse.end(html);
									});
								});
							}
							
							//	check whether single content requested
							else {
								contentObj.getContentBy('slug', urlParts[1], urlParts[0], function(itemInfo) {
									httpResponse.render(urlParts[0], {
										info: itemInfo
									});
								}, function() {
									httpResponse.redirect('/404');
								});
							}
						}, 
						function() {
							httpResponse.redirect('/404');
						}
					);
				}
			);
		});
	});
};

