var appConfigObj = require('./library/config').loadConfig();
var utilObj = require('./library/util');
var helperObj = require('./library/helper');
var url = require('url');
var logger = require('morgan');

//	required express configurations
var express = require('express')
	multer  = require('multer')
	bodyParser = require('body-parser')
	expressLayouts = require('express-ejs-layouts')
	session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.set('port', (process.env.PORT || appConfigObj.port));
app.set('view engine', 'ejs');
app.set('views', __dirname + appConfigObj.theme.path + '/views');
app.set('layout', __dirname + appConfigObj.theme.layout);

//	define static paths
app.use('/favicon.ico', express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + appConfigObj.theme.path + '/public'));
app.use('/mp-manager', express.static(__dirname + '/mp-manager/public'));
app.use('/media', express.static(__dirname + '/media'));
app.use(logger());
app.use(multer({
	dest: './media/' + new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDate() + '/'
}));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(expressLayouts);
app.use(session({
	secret: appConfigObj.session.secret,
	saveUninitialized: true,
	resave: true,
	store: new MongoStore({
		host: appConfigObj.database.host,
		port: appConfigObj.database.port,
		db: appConfigObj.database.db,
		collection: 'sessions'
	})
}));

//	load global values & configurations
app.use(function (httpRequest, httpResponse, next) {
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

app.get('/', function(httpRequest, httpResponse) {
	//	httpResponse.end('home');
	httpResponse.render('home');
});

app.get('/mp-manager', function(httpRequest, httpResponse) {
		if(true === httpRequest.session.loggedin) {
		app.set('views', __dirname + '/mp-manager/views');
		app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
		
		httpResponse.render('dashboard');
	}
	else {
		httpResponse.redirect('/mp-manager/login?msgcode=SESSION_TIMEOUT');
	}
});

app.get('/mp-manager/invalid', function(httpRequest, httpResponse) {
	httpResponse.end('!!!	Security Alert	!!!');
});

/**
 * Account Register
 */
app.get('/mp-manager/register', function(httpRequest, httpResponse) {
	app.set('views', __dirname + '/mp-manager/views');
	app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
	
	httpResponse.render('register');
}).post('/mp-manager/register', function(httpRequest, httpResponse) {
	var userObj = require('./library/user');
	userObj.signin({
		email: httpRequest.body.email,
		password: httpRequest.body.password
	}, function(userInfo) {
		httpRequest.session.loggedin = true;
		httpRequest.session.userId = userInfo._id;
		httpResponse.redirect('/mp-manager');
	}, function(err) {
		httpResponse.redirect('/mp-manager/login?msgcode=INVALID_CREDENTIAL');
	});
	
});


/**
 * Account Login
 */
app.get('/mp-manager/login', function(httpRequest, httpResponse) {
	app.set('views', __dirname + '/mp-manager/views');
	app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
	
	httpResponse.render('login');
}).post('/mp-manager/login', function(httpRequest, httpResponse) {
	var userObj = require('./library/user');
	userObj.signin({
		email: httpRequest.body.email,
		password: httpRequest.body.password
	}, function(userInfo) {
		httpRequest.session.loggedin = true;
		httpRequest.session.userId = userInfo._id;
		httpResponse.redirect('/mp-manager');
	}, function(err) {
		httpResponse.redirect('/mp-manager/login?msgcode=INVALID_CREDENTIAL');
	});
});


/**
 * Forgot password
 */
app.get('/mp-manager/login/lost-password', function(httpRequest, httpResponse) {
	app.set('views', __dirname + '/mp-manager/views');
	app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
	
	httpResponse.render('lost-password');
}).post('/mp-manager/login/lost-password', function(httpRequest, httpResponse) {
	var userObj = require('./library/user');
	userObj.signin({
		email: httpRequest.body.email,
		password: httpRequest.body.password
	}, function(userInfo) {
		httpRequest.session.loggedin = true;
		httpRequest.session.userId = userInfo._id;
		httpResponse.redirect('/mp-manager');
	}, function(err) {
		httpResponse.redirect('/mp-manager/login?msgcode=INVALID_EMAIL');
	});
});

/**
 * Super Admin Logout
 */
app.get('/mp-manager/logout', function(httpRequest, httpResponse) {
	httpRequest.session.destroy();
	httpResponse.redirect('/mp-manager/login');
});

app.get('/mp-manager/contents', function(httpRequest, httpResponse) {
	if(true === httpRequest.session.loggedin) {
		app.set('views', __dirname + '/mp-manager/views');
		app.set('layout', __dirname + '/mp-manager/views/layout.ejs');

		require('./library/content').getContentList({
			type: httpRequest.query.type
		}, function(contentList) {
			httpResponse.render('contents', {
				locals: {
					type: httpRequest.query.type,
					contents: contentList
				}
			});
		});
	}
	else {
		httpResponse.redirect('/mp-manager/login?msgcode=SESSION_TIMEOUT');
	}
});

app.get('/mp-manager/update-content', function(httpRequest, httpResponse) {
	if(true === httpRequest.session.loggedin) {
		if(httpRequest.query.cid) {
			app.set('views', __dirname + '/mp-manager/views');
			app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
			
			require('./library/content').ContentModel.findOne({
				'_id': httpRequest.query.cid
			}, function (err, docInfo) {
				httpResponse.render('update-content', {
					locals: {
						cid:  httpRequest.query.cid,
						contentInfo: docInfo
					}
				});
			});
		}
		else {
			var contentObj = new require('./library/content');
			var contentModelObj = contentObj.ContentModel();
			contentModelObj.type = httpRequest.query.type;
			contentModelObj.status = contentObj.statusList.INITIATE;
			contentModelObj.save(function(err, docInfo) {
				if(err)
					console.log(err);
				else
					httpResponse.redirect(httpRequest.url + '&cid='+docInfo._id);
			});
		}
	}
	else {
		httpResponse.redirect('/mp-manager/login?msgcode=SESSION_TIMEOUT');
	}
}).post('/mp-manager/update-content', function(httpRequest, httpResponse) {
	if(httpRequest.query.cid == httpRequest.body.cid && httpRequest.body.title) {
		var contentObj = new require('./library/content');
		contentObj.updateContent(httpRequest.body, httpRequest.session.userId, function() {
			/**
			 * save post meta
			 */
			contentObj.saveMetaInfo(httpRequest.body.cid, 'metaTitle', httpRequest.body.metaTitle);
			contentObj.saveMetaInfo(httpRequest.body.cid, 'metaDescription', httpRequest.body.metaDescription);
			contentObj.saveMetaInfo(httpRequest.body.cid, 'metaKeywords', httpRequest.body.metaKeywords);
			contentObj.saveMetaInfo(httpRequest.body.cid, 'ogTitle', httpRequest.body.ogTitle);
			contentObj.saveMetaInfo(httpRequest.body.cid, 'ogDescription', httpRequest.body.ogDescription);
			contentObj.saveMetaInfo(httpRequest.body.cid, 'ogType', httpRequest.body.ogType);
			
			/**
			 * link attachment files to the current post
			 */
			if(httpRequest.files.attachments) {
				contentObj.saveAttachmentInfo(httpRequest.body.cid, httpRequest.session.userId, httpRequest.files.attachments, function() {
					httpResponse.redirect(httpRequest.url);
				});
			}
			else {
				httpResponse.redirect(httpRequest.url);
			}
		});
	}
	else {
		httpResponse.redirect('/mp-manager/invalid');
	}
});

app.get('/mp-manager/remove-content', function(httpRequest, httpResponse) {
	require('./library/content').remove({
		type: httpRequest.query.type,
		cid: httpRequest.query.cid,
		userId: httpRequest.session.userId
	}, function() {
		httpResponse.redirect('/mp-manager/contents?type='+httpRequest.query.type);
	});
});


app.get('/mp-manager/settings', function(httpRequest, httpResponse) {
	app.set('views', __dirname + '/mp-manager/views');
	app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
	
	httpResponse.render('settings');
});

app.get('/mp-manager/settings/themes', function(httpRequest, httpResponse) {
	app.set('views', __dirname + '/mp-manager/views');
	app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
	
	httpResponse.render('themes');
});

app.get('/mp-manager/settings/theme-activate', function(httpRequest, httpResponse) {
	httpResponse.end('in progress');
});

/*app.get('/mp-manager/page', function(httpRequest, httpResponse) {
	switch(httpRequest.query.slug) {
		case 'content-types':
			httpResponse.render('page', {
				html: '<h1 class="">Page Heading</h1>'
			});
		break;
	}
});

app.post('/mp-manager/upload-media/:cid', function(httpRequest, httpResponse) {
	console.log(httpRequest.body);
	console.log(httpRequest.files);
	httpResponse.end('done');
});*/

/**
 * installer configurations
 */
app.get('/mp-manager/installer', function(httpRequest, httpResponse) {
	utilObj.isSystemInstalled(function() {
		httpResponse.end('Sorry!!! Can\'t re-run installer. System is already installed.');
	}, function() {
		app.set('views', __dirname + '/mp-manager/views');
		app.set('layout', __dirname + '/mp-manager/views/layout.ejs');
		httpResponse.render('installer');
	});
}).post('/mp-manager/installer', function(httpRequest, httpResponse) {
	if(	'' != httpRequest.body.sitename &&
		'' != httpRequest.body.email &&
		'' != httpRequest.body.password &&
		'' != httpRequest.body.repassword &&
		httpRequest.body.password == httpRequest.body.repassword) {
		var installtedObj = require('./library/installer');
		installtedObj.saveBasicDetials({
			sitename: httpRequest.body.sitename,
			email: httpRequest.body.email,
			password: httpRequest.body.password,
		}, function(info) {
			httpResponse.redirect('/mp-manager/login');
		}, function(err) {
			console.log(err);
			httpResponse.end('Sorry for inconvenience!!! Please check logs on the server.');
		});
	}
	else {
		httpResponse.redirect('/mp-manager/installer?msgcode=INVALID_FORM_DATA');
	}
});

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

/**
 * 404 page handler
 */
app.get('/404', function(httpRequest, httpResponse) {
	httpResponse.end('404 Page...');
	//	httpResponse.render('index');
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
	
	var contentValidator = require('./library/validator');
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
						var contentObj = require('./library/content');
						
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

//	start node Express Server
app.listen(app.get('port'), function() {
	console.log("Mopublish is running at localhost:" + app.get('port'));
});
