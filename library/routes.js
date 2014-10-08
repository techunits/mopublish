var fs = require('fs');
var url = require('url');
var mpObj = require(ROOT_PATH + '/library/mopublish');
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
				mpObj.helper.isSystemInstalled(function() {
					//	app.set('installed', true);
					
					var themeConfigObj = require(ROOT_PATH + '/library/config').loadThemeSettings(siteSettings.theme);
					
					/**
					 * append required varriables to the template.
					 */
					httpResponse.locals = {
						httpReq: httpRequest,
						stylesheets: '',
						scripts: '',
						siteHeader: '',
						siteFooter: '',
						opengraph: require(ROOT_PATH + '/library/template').getOpengraphHTML(siteConfigObj.opengraph),
						seometa: require(ROOT_PATH + '/library/template').getSeoMetaHTML(siteConfigObj.seometa),
						pagetitle: require(ROOT_PATH + '/library/template').getPageTitle(),
						isLoggedin: httpRequest.session.loggedin,
						mp: mpObj,
						globalLocals: siteConfigObj
				    };
					
					/**
					 * add conditional stylesheets
					 */
					mpObj.on("MP:STYLESHEET", function(stylesheetList) {
						var stylesheets = httpResponse.locals.stylesheets;
						stylesheetList.forEach(function(fileInfo) {
							stylesheets += '<link rel="stylesheet" type="text/css" href="'+fileInfo.file+'" />';
						});
						
						httpResponse.locals.stylesheets = stylesheets;
					});
					
					/**
					 * add conditional javascripts
					 */
					mpObj.on("MP:SCRIPT", function(scriptList) {
						var scripts = httpResponse.locals.scripts;
						scriptList.forEach(function(fileInfo) {
							scripts += '<script type="text/javascript" src="'+fileInfo.file+'"></script>';
						});
						
						httpResponse.locals.scripts = scripts;
					});
					
					/**
					 * add opengraph data to template vars
					 */
					mpObj.on("MP:OPENGRAPH", function(ogData) {
						//	console.log(httpRequest.url + '=> great...');
						if(ogData) {
							httpResponse.locals.opengraph = require(ROOT_PATH + '/library/template').getOpengraphHTML(ogData);
						}
					});
					
					/**
					 * add opengraph data to template vars
					 */
					mpObj.on("MP:SEOMETA", function(seometaData) {
						if(seometaData) {
							httpResponse.locals.seometa = require(ROOT_PATH + '/library/template').getSeoMetaHTML(seometaData);
						}
					});
					
					/**
					 * update pagetitle as per requirements
					 */
					mpObj.on("MP:PAGETITLE", function(titleStr) {
						if(titleStr) {
							httpResponse.locals.pagetitle = titleStr;
						}
					});
					
					/**
					 * add mpHeader data to template vars
					 */
					mpObj.on("MP:HEADER", function(str) {
						if(str) {
							httpResponse.locals.siteHeader += str;
						}
					});
					
					/**
					 * add mpFooter data to template vars
					 */
					mpObj.on("MP:FOOTER", function(str) {
						console.log(str);
						if(str) {
							httpResponse.locals.siteFooter += str;
						}
					});
					
					
					//	include stylesheets
					if(themeConfigObj.stylesheets) {
						mpObj.emit('MP:STYLESHEET', themeConfigObj.stylesheets);
					}
					
					//	include scripts
					if(themeConfigObj.scripts) {
						mpObj.emit('MP:SCRIPT', themeConfigObj.scripts);
					}
					
					/**
					 * if request URL is admin then append Admin Sidebar menu.
					 */
					if(-1 != httpRequest.url.indexOf('mp-manager')) {						
						var menuHtmlStr = '';
						//	prepare content type menus
						require(ROOT_PATH + '/library/content').ContentTypeModel.find(function(err, docs) {
							
							docs.forEach(function(docInfo) {
								menuHtmlStr += '<ul class="menu-section">'+
													'<li class="heading"><i class="glyphicon glyphicon-th"></i> '+docInfo.title+'</li>'+
													'<li>'+
														'<a href="/mp-manager/contents?type='+docInfo.slug+'" title="All Posts">All '+docInfo.title+'</a>'+
													'</li>'+
													'<li>'+
														'<a href="/mp-manager/update-content?type='+docInfo.slug+'" title="Add New Blog Post">Add New</a>'+
													'</li>'+
												'</ul>';
							});
							
							httpResponse.locals.adminmenu = menuHtmlStr;
							
							next();
						});
					}
					else {
						next();
					}
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
        	if(true === appConfigObj.debug) {
        		console.log('Loading Routes: ' + route);
        	}
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
		
		var cmsHandler = require(ROOT_PATH + '/library/cmsHandler');
		
		//	handle 404 pages
		cmsHandler.on('MP:_TYPE_404', function() {
			httpResponse.redirect('/404');
		});
		
		//	handle single page
		cmsHandler.on('MP:_TYPE_PAGE', function(itemInfo) {
			require(ROOT_PATH + '/library/content').getContentBy('slug', itemInfo.slug, itemInfo.type, function(itemInfo) {
				/**
				 * event runs 
				 */
				mpObj.emit("MP:SINGLE", itemInfo);
				
				//	update page title
		    	mpObj.emit("MP:PAGETITLE", require(ROOT_PATH + '/library/template').getPageTitle(itemInfo.info.title));
				
		    	//	update opengraph if exists
		    	if(itemInfo.meta.opengraph)
		    		mpObj.emit("MP:OPENGRAPH", itemInfo.meta.opengraph);
				
		    	//	update SEO meta tags if exists
		    	if(itemInfo.meta.seometa)
		    		mpObj.emit("MP:SEOMETA", itemInfo.meta.seometa);
		    	
	    		
				httpResponse.render('page', itemInfo);
			}, function() {});
		});
		
		//	handle single content pages
		cmsHandler.on('MP:_TYPE_CONTENT_SINGLE', function(itemInfo) {
			/**
			 * event runs 
			 */
			mpObj.emit("MP:SINGLE", itemInfo);
			
			//	update page title
	    	mpObj.emit("MP:PAGETITLE", require(ROOT_PATH + '/library/template').getPageTitle(itemInfo.info.title));
			
	    	//	update opengraph if exists
	    	if(itemInfo.meta.opengraph)
	    		mpObj.emit("MP:OPENGRAPH", itemInfo.meta.opengraph);
			
	    	//	update SEO meta tags if exists
	    	if(itemInfo.meta.seometa)
	    		mpObj.emit("MP:SEOMETA", itemInfo.meta.seometa);
	    	
			httpResponse.render('single', itemInfo);
		});
		
		//	handle content archives
		cmsHandler.on('MP:_TYPE_CONTENT_ARCHIVE', function() {
			httpResponse.end('!!!	Content Archive: Coming Soon	!!!');
		});
		
		//	handle taxonomy archive
		cmsHandler.on('MP:_TYPE_TAXONOMY', function() {
			httpResponse.end('!!!	Taxonomy Archive: Coming Soon	!!!');
		});
		
		cmsHandler.triggerPage(urlParts);
	});
};

