var utilObj = require(ROOT_PATH + '/library/util');
var helperObj = require(ROOT_PATH + '/library/helper');

module.exports = function(app) {
	app.get('/mp-manager', function(httpRequest, httpResponse) {
		if(true === httpRequest.session.loggedin) {
			httpResponse.render('dashboard');
		}
		else {
			httpResponse.redirect('/mp-manager/login?msgcode=SESSION_EXPIRED');
		}
	});
	
	app.get('/mp-manager/invalid', function(httpRequest, httpResponse) {
		httpResponse.end('!!!	Security Alert	!!!');
	});
	
	/**
	 * Account Register
	 */
	app.get('/mp-manager/register', function(httpRequest, httpResponse) {
		if(1 == siteConfigObj.allowUserRegistration) {
			httpResponse.render('register');
		} 
		else {
			httpResponse.redirect('/404?msgcode=REGISTRATION_NOT_ALLOWED');
		}
	}).post('/mp-manager/register', function(httpRequest, httpResponse) {
		if(1 == siteConfigObj.allowUserRegistration) {
			var userObj = require(ROOT_PATH + '/library/user');
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
		}
		else {
			httpResponse.redirect('/404?msgcode=REGISTRATION_NOT_ALLOWED');
		}
	});
	
	
	/**
	 * Account Login
	 */
	app.get('/mp-manager/login', function(httpRequest, httpResponse) {
		httpResponse.render('login');
	}).post('/mp-manager/login', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/user').signin({
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
		httpResponse.render('lost-password');
	}).post('/mp-manager/login/lost-password', function(httpRequest, httpResponse) {
		if('' != httpRequest.body.email) {
			require(ROOT_PATH + '/library/user').generatePasswordToken(httpRequest.body.email, function(userInfo) {
				console.log(userInfo);
				httpResponse.redirect('/mp-manager/login/lost-password?msgcode=SUCCESS');
			}, function() {
				httpResponse.redirect('/mp-manager/login/lost-password?msgcode=NO_EMAIL');
			});	
		}
		else {
			httpResponse.redirect('/mp-manager/login/lost-password?msgcode=MISSING_EMAIL');
		}
	});
	
	/**
	 * Reset password
	 */
	app.get('/mp-manager/login/reset-password', function(httpRequest, httpResponse) {
		if(httpRequest.query.token && '' != httpRequest.query.token && httpRequest.query.id && '' != httpRequest.query.id) {
			httpResponse.render('reset-password', {
				locals: {
					token: httpRequest.query.token,
					userId: httpRequest.query.id
				}
			});
		}
		else {
			httpResponse.redirect('/mp-manager/login/lost-password?msgcode=MISSING_DATA');
		}
	}).post('/mp-manager/login/reset-password', function(httpRequest, httpResponse) {
		if(httpRequest.body.token && 
				'' != httpRequest.body.token && 
				httpRequest.body.id && 
				'' != httpRequest.body.id && 
				httpRequest.body.email && 
				'' != httpRequest.body.email &&
				httpRequest.body.password && 
				'' != httpRequest.body.password) {
			require(ROOT_PATH + '/library/user').resetPassword({
				userId: httpRequest.body.id,
				email: httpRequest.body.email,
				token: httpRequest.body.token,
				password: httpRequest.body.password
			}, function(userInfo) {
				httpResponse.redirect('/mp-manager/login');
			}, function() {
				httpResponse.redirect('/mp-manager/login/lost-password?msgcode=TOKEN_EXPIRED');
			});
		}
		else {
			httpResponse.redirect('/mp-manager/login/lost-password?msgcode=TOKEN_EXPIRED');
		}
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
			require(ROOT_PATH + '/library/content').getContentList({
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
			httpResponse.redirect('/mp-manager/login?msgcode=SESSION_EXPIRED');
		}
	});
	
	app.get('/mp-manager/update-content', function(httpRequest, httpResponse) {
		if(true === httpRequest.session.loggedin) {
			if(httpRequest.query.cid) {
				require(ROOT_PATH + '/library/content').getContentBy('_id', httpRequest.query.cid, httpRequest.query.type, function (docInfo) {
					console.log(docInfo);
					httpResponse.render('update-content', {
						locals: {
							cid:  httpRequest.query.cid,
							content: docInfo
						}
					});
				}, function() {});
			}
			else {
				var contentObj = new require(ROOT_PATH + '/library/content');
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
			httpResponse.redirect('/mp-manager/login?msgcode=SESSION_EXPIRED');
		}
	}).post('/mp-manager/update-content', function(httpRequest, httpResponse) {
		if(httpRequest.query.cid == httpRequest.body.cid && httpRequest.body.title) {
			var contentObj = new require(ROOT_PATH + '/library/content');
			contentObj.updateContent(httpRequest.body, httpRequest.session.userId, function() {
				/**
				 * save post meta
				 */
				contentObj.saveMetaInfo(httpRequest.body.cid, 'seometa', {
					title: httpRequest.body.metaTitle,
					description: httpRequest.body.metaDescription,
					keywords: httpRequest.body.metaKeywords
				});
				
				contentObj.saveMetaInfo(httpRequest.body.cid, 'opengraph', {
					title: httpRequest.body.ogTitle,
					description: httpRequest.body.ogDescription,
					type: httpRequest.body.ogType
				});
				
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
		require(ROOT_PATH + '/library/content').remove({
			type: httpRequest.query.type,
			cid: httpRequest.query.cid,
			userId: httpRequest.session.userId
		}, function() {
			httpResponse.redirect('/mp-manager/contents?type='+httpRequest.query.type);
		});
	});
	
	/**
	 * Menu Handler: Settings -> General
	 */
	app.get('/mp-manager/settings', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').loadSettings(function(settingsList) {
			httpResponse.render('settings', {
				locals: {
					settings: settingsList,
					timezoneList: require(ROOT_PATH + '/library/config').loadData('timezone')
				}
			});
		});
	}).post('/mp-manager/settings', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').saveSettingsList([
		    {
		    	key: 'sitename',
		    	value: httpRequest.body.sitename
		    },
		    {
		    	key: 'tagline',
		    	value: httpRequest.body.tagline
		    },
		    {
		    	key: 'description',
		    	value: httpRequest.body.description
		    },
		    {
		    	key: 'email',
		    	value: httpRequest.body.email
		    },
		    {
		    	key: 'timezone',
		    	value: httpRequest.body.timezone
		    },
		    {
		    	key: 'allowUserRegistration',
		    	value: httpRequest.body.allowUserRegistration
		    },
		    {
		    	key: 'smtp',
		    	value: {
		    		host: httpRequest.body.smtpHost,
		    		port: httpRequest.body.smtpPort,
		    		mode: httpRequest.body.smtpMode,
		    		auth: {
		    			username: httpRequest.body.smtpUsername,
		    			password: httpRequest.body.smtpPassword
		    		}
		    	}
		    }
		], function(settingsList) {
			//	reload page
			httpResponse.redirect(httpRequest.url);
		});
	});
	
	
	/**
	 * Menu Handler: Settings -> Opengraph
	 */
	app.get('/mp-manager/settings/opengraph', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').loadSettings(function(settingsList) {
			httpResponse.render('opengraph', {
				locals: {
					settings: settingsList
				}
			});
		});
	}).post('/mp-manager/settings/opengraph', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').saveSettingsList([
		    {
		    	key: 'opengraph',
		    	value: {
		    		title: httpRequest.body.ogTitle,
		    		url: httpRequest.body.ogUrl,
		    		type: httpRequest.body.ogType,
		    		image: httpRequest.body.ogImage,
		    		video: httpRequest.body.ogVideo,
		    		description: httpRequest.body.ogDescription
		    	}
		    }
		], function(settingsList) {
			//	reload page
			httpResponse.redirect(httpRequest.url);
		});
	});
	
	/**
	 * Menu Handler: Settings -> Opengraph
	 */
	app.get('/mp-manager/settings/seo-meta', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').loadSettings(function(settingsList) {
			httpResponse.render('seo-meta', {
				locals: {
					settings: settingsList
				}
			});
		});
	}).post('/mp-manager/settings/seo-meta', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').saveSettingsList([
		    {
		    	key: 'seometa',
		    	value: {
		    		title: httpRequest.body.seoTitle,
		    		description: httpRequest.body.seoDescription,
		    		keywords: httpRequest.body.seoKeywords
		    	}
		    }
		], function(settingsList) {
			//	reload page
			httpResponse.redirect(httpRequest.url);
		});
	});
	
	
	/**
	 * Menu Handler: Settings -> Themes
	 */
	app.get('/mp-manager/settings/themes', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').loadThemes(function(themeList) {
			httpResponse.render('themes', {
				locals: {
					themes: themeList,
					activated: siteConfigObj.theme
				}
			});
		});
		
	});
	
	/**
	 * Activate New theme
	 * Menu Handler: Settings -> Themes -> Activate Theme
	 */
	app.get('/mp-manager/settings/theme-activate', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').updateSettings('theme', httpRequest.query.t, function() {
			httpResponse.redirect(httpRequest.get('referer'));
			process.reload();
		});
	});
	
	/**
	 * Menu Handler: Settings -> Content Types
	 */
	app.get('/mp-manager/settings/content-types', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/content').ContentTypeModel.find(function(err, itemList) {
			httpResponse.render('content-types', {
				locals: {
					contentTypes: itemList
				}
			});
		});
	}).post('/mp-manager/settings/content-types', function(httpRequest, httpResponse) {
		if(httpRequest.body.title && httpRequest.body.slug) {
			new require(ROOT_PATH + '/library/content').ContentTypeModel({
				slug: httpRequest.body.slug,
				title: httpRequest.body.title,
				description: httpRequest.body.description,
				hierarchical: (0 == httpRequest.body.hierarchical)?false:true
			}).save(function(err, docInfo) {
				httpResponse.redirect(httpRequest.url);
			});
		}
	});
	
	/**
	 * Menu Handler: Settings -> REST API
	 */
	app.get('/mp-manager/settings/api/rest', function(httpRequest, httpResponse) {
		require(ROOT_PATH + '/library/settings').RESTSettingsModel.find(function(err, apiList) {
			httpResponse.render('api', {
				locals: {
					apiList: apiList
				}
			});
		});
	});
	
	/**
	 * Menu Handler: Settings -> Social Media
	 */
	app.get('/mp-manager/settings/social-media', function(httpRequest, httpResponse) {
		httpResponse.render('social-media');
	}).post('/mp-manager/settings/social-media', function(httpRequest, httpResponse) {
		httpResponse.render('social-media');
	});
	
	/**
	 * Menu Handler: Support
	 */
	app.get('/mp-manager/support', function(httpRequest, httpResponse) {
		httpResponse.render('support', {
			locals: {
				type: httpRequest.query.type
			}
		});
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
			httpResponse.render('installer');
		});
	}).post('/mp-manager/installer', function(httpRequest, httpResponse) {
		if(	'' != httpRequest.body.sitename &&
			'' != httpRequest.body.email &&
			'' != httpRequest.body.password &&
			'' != httpRequest.body.repassword &&
			httpRequest.body.password == httpRequest.body.repassword) {
			var installtedObj = require(ROOT_PATH + '/library/installer');
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
};