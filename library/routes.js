var fs = require('fs');
var url = require('url');
var utilObj = require(ROOT_PATH + '/library/util');
var helperObj = require(ROOT_PATH + '/library/helper');
var multer  = require('multer');

/**
 * load global settings from config file
 */
global.appConfigObj = require(ROOT_PATH + '/library/config').loadConfig();

/**
 * load site based settings from Database
 */
require(ROOT_PATH + '/library/config').loadSiteSettings(function(siteSettings) {
	global.siteConfigObj = siteSettings;
});

module.exports = function(app, express) {
	/**
	 * Initialize Session
	 */
	var session = require('express-session');
	var MongoStore = require('connect-mongo')(session);
	app.use(session({
		secret: appConfigObj.session.secret,
		saveUninitialized: true,
		resave: true,
		store: new MongoStore({
			host: appConfigObj.database.host,
			port: appConfigObj.database.port,
			db: appConfigObj.database.db,
			username: appConfigObj.database.username,
			password: appConfigObj.database.password,
			collection: 'sessions'
		})
	}));
	
	/**
	 * define static file & media paths
	 */
	app.use('/', express.static(ROOT_PATH + '/public'));
	app.use('/media', express.static(ROOT_PATH + '/' + appConfigObj.uploads.path));
	app.use('/mp-manager', express.static(ROOT_PATH + '/themes/mp-manager/assets'));
	app.use('/assets', express.static(ROOT_PATH + '/themes'));
	
	/**
	 * add file upload global handler
	 */
	app.use(multer({
		dest: ROOT_PATH + '/media/' + new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDate() + '/'
	}));
	
	
	/**
	 * load global values & configurations
	 */
	app.use(function (httpRequest, httpResponse, next) {
		require(ROOT_PATH + '/library/config').loadSiteSettings(function(siteSettings) {
			global.siteConfigObj = siteSettings;
			
			//	if url is /mp-manager then use default Admin theme
			if(-1 != httpRequest.url.indexOf('/mp-manager')) {
				app.set('views', ROOT_PATH + '/themes/mp-manager/views');
				app.set('layout', ROOT_PATH + '/themes/mp-manager/layout/default.ejs');
			}
			else {
				app.set('views', ROOT_PATH + '/themes/' + siteConfigObj.theme + '/views');
				app.set('layout', ROOT_PATH + '/themes/' + siteConfigObj.theme + '/layout/default.ejs');
			}
			
			//	check whether system is installed and set the global parameter.
			if('/mp-manager/installer' != httpRequest.url) {
				utilObj.isSystemInstalled(function() {
					//	app.set('installed', true);
					
					var themeConfigObj = require(ROOT_PATH + '/library/config').loadThemeSettings(siteSettings.theme);
					
					//	stylesheets html
					var stylesheets = '';
					themeConfigObj.stylesheets.forEach(function(fileInfo) {
						stylesheets += '<link rel="stylesheet" type="text/css" href="'+fileInfo.file+'" />';
					});
					
					//	scripts html
					var scripts = '';
					themeConfigObj.scripts.forEach(function(fileInfo) {
						scripts += '<script type="text/javascript" src="'+fileInfo.file+'"></script>';
					});
					
					httpResponse.locals = {
						httpReq: httpRequest,
						stylesheets: stylesheets,
						scripts: scripts,
						isLoggedin: httpRequest.session.loggedin,
						mpObj: {
							util: utilObj,
							helper: helperObj
						},
						globalLocals: siteConfigObj
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
					isLoggedin: httpRequest.session.loggedin,
					globalLocals: {
						sitename: 'Welcome to Mopublish - Innovative & Flexible NodeJS CMS',
					}
			    };
				next();
			}
		});
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

