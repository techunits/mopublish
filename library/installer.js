var helperObj = require('../library/helper');
var utilObj = require('../library/helper');
var contentObj = require('../library/content');
var logger = require(ROOT_PATH + '/library/logger');
var mailer = require(ROOT_PATH + '/library/mailer');
var md5 = require('MD5');
var async = require('async');

var nullCallback = function() {
};

exports.saveBasicDetials = function(params, success, failed) {
	async.waterfall([ function(callback) {
		logger.info('Sitename: ' + params.sitename);

		// save site name / title
		new require('../library/settings').SettingsModel({
			key : 'sitename',
			value : params.sitename,
		}).save(function(err, docInfo) {
			if (err)
				console.log(err);

			callback();
		});
	}, function(callback) {
		logger.info('Admin Email: ' + params.email);

		// save site webmaster email
		new require('../library/settings').SettingsModel({
			key : 'email',
			value : params.email,
		}).save(function(err, docInfo) {
			if (err)
				console.log(err);

			callback();
		});
	}, function(callback) {
		logger.info('Admin User: ' + params.email);

		// signup super admin user
		var userObj = require('../library/user').UserModel({
			email : params.email,
			password : md5(params.password),
			status : 1
		});
		userObj.save(function(err, userInfo) {
			if (err)
				console.log(err);

			// load api settings
			if (userInfo) {
				var userId = userInfo._id;
				loadDefaultRESTAPISettings(userId);
				callback(null, userId);
			}
		});
	}, function(userId, callback) {
		logger.info('Saving user roles(admin) for: ' + userId);

		// set super admin user roles
		var roleObj = require('../library/user').UserRoleModel({
			userId : userId,
			role : 'admin'
		});
		roleObj.save(function(err, roleInfo) {
			if (err)
				console.log(err);
			else
				callback(null, userId);
		});
	}, function(userId, callback) {
		logger.info('Loading content types...');

		// load default content types
		loadDefaultContentTypes();
		callback(null, userId);
	}, function(userId, callback) {
		logger.info('Loading default contents...');

		// load default contents
		loadDefaultContents(userId);
		callback();
	}, function(callback) {
		logger.info('Loading default taxonomies...');

		// load default taxonomies
		loadDefaultTaxonomies();
		callback();
	}, function(callback) {
		logger.info('Loading default taxonomy terms...');

		// load default taxonomy terms
		loadDefaultTaxonomyTerms();
		callback();
	}, function(callback) {
		logger.info('Loading default settings...');

		// load more default settings
		loadDefaultSettings();
		callback();
	} ], function(err, results) {
		if (err) {
			console.log(err);
			failed();
		} else {
			// save status as installed
			new require('../library/settings').SettingsModel({
				key : 'installed',
				value : true
			}).save(function(err, docInfo) {
				if (err)
					failed(docInfo);
				else {
					logger.info('Installation Successful.');
					mailer.sendEmail({
						toEmail: params.email,
					    subject: 'Welcome to Mopublish',
					    textContent: 'You have successfully installed Mopublish.',
					    htmlContent: '<p>You have successfully installed Mopublish. New mail template is coming soon.</p>'
					}, function() {
						success();
					});
				}
			});
		}
	});
};

/**
 * load default content types
 */
var loadDefaultContentTypes = function(callback) {
	// load default content types
	var contentTypeList = [ {
		slug : 'page',
		title : 'Page',
		description : 'Content type page with hierarchy support.',
		hierarchical : true
	}, {
		slug : 'blog',
		title : 'Blog',
		description : 'Content type blog with no hierarchy support.',
		hierarchical : false
	} ];
	contentTypeList.forEach(function(contentTypeInfo) {
		new require('../library/content').ContentTypeModel(contentTypeInfo)
				.save(function(err, docInfo) {
					if (err)
						console.log(err);
				});
	});
};

/**
 * load default contents
 */
var loadDefaultContents = function(userId, callback) {
	// load default pages
	var contentList = [
			{
				type : 'page',
				title : 'About Us',
				slug : helperObj.sanetizeTitle('About Us'),
				description : 'Welcome to Mopublish About Us Page. Please add contents as per your requirements here.',
				excerpt : 'Welcome to Mopublish About Us Page.',
				userId : userId,
				parentId : false,
				status : contentObj.statusList.PUBLISH
			},
			{
				type : 'page',
				title : 'Privacy Policy',
				slug : helperObj.sanetizeTitle('Privacy Policy'),
				description : 'Welcome to Mopublish Privacy Policy Page. Please add contents as per your requirements here.',
				excerpt : 'Welcome to Mopublish Privacy Policy Page.',
				userId : userId,
				parentId : false,
				status : contentObj.statusList.PUBLISH
			},
			{
				type : 'page',
				title : 'Terms of Service',
				slug : helperObj.sanetizeTitle('Terms of Service'),
				description : 'Welcome to Mopublish Terms of Service Page. Please add contents as per your requirements here.',
				excerpt : 'Welcome to Mopublish Terms of Service Page.',
				userId : userId,
				parentId : false,
				status : contentObj.statusList.PUBLISH
			},
			{
				type : 'page',
				title : 'Contact Us',
				slug : helperObj.sanetizeTitle('Contact Us'),
				description : 'Welcome to Mopublish About Us Page. Please add contents as per your requirements here.',
				excerpt : 'Welcome to Mopublish About Us Page.',
				userId : userId,
				parentId : false,
				status : contentObj.statusList.PUBLISH
			},
			{
				type : 'blog',
				title : 'Welcome to Mopublish First Post',
				slug : helperObj
						.sanetizeTitle('Welcome to Mopublish First Post'),
				description : 'This is first post on Mopublish CMS. Hope you will have great time and nice growth in business with Mopublish. Have a nice journey...',
				excerpt : 'This is first post on Mopublish CMS.',
				userId : userId,
				parentId : false,
				status : contentObj.statusList.PUBLISH
			}

	];

	contentList.forEach(function(contentInfo) {
		new require('../library/content').ContentModel(contentInfo).save(
				function(err, docInfo) {
					if (err)
						console.log(err);
				});
	});
};

/**
 * load default Taxonomy Types
 */
var loadDefaultTaxonomies = function(callback) {
	// load default taxonomy types
	var taxonomyTypeList = [ {
		slug : 'category',
		title : 'Category',
		description : 'Taxonomy Category with hierarchy support.',
		hierarchical : true
	}, {
		slug : 'tag',
		title : 'Tags',
		description : 'Taxonomy Tags blog with no hierarchy support.',
		hierarchical : false
	} ];

	taxonomyTypeList.forEach(function(taxonomyTypeInfo) {
		new require('../library/taxonomy').TaxonomyTypeModel(taxonomyTypeInfo)
				.save(function(err, docInfo) {
					if (err)
						console.log(err);
				});
	});
};

/**
 * load default Taxonomy Terms
 */
var loadDefaultTaxonomyTerms = function(callback) {
	// load default taxonomy types
	var taxonomyTermList = [ {
		slug : helperObj.sanetizeTitle('default'),
		title : 'Default',
		taxonomy : 'category'
	}, {
		slug : helperObj.sanetizeTitle('Example Tag'),
		title : 'Example Tag',
		taxonomy : 'tag'
	} ];

	taxonomyTermList.forEach(function(taxonomyTermInfo) {
		new require('../library/taxonomy').TaxonomyTermModel(taxonomyTermInfo)
				.save(function(err, docInfo) {
					if (err)
						console.log(err);
				});
	});
};

/**
 * load default settings list
 */
var loadDefaultSettings = function() {
	var settingList = [ {
		key : 'smtp',
		value : {
			host : 'localhost',
			port : 25,
			mode : '',
			auth : {
				username : '',
				password : ''
			}
		}
	}, {
		key : 'timzeone',
		value : 'UTC'
	}, {
		key : 'dateformat',
		value : 'd-m-Y'
	}, {
		key : 'timeformat',
		value : 'h:i:s'
	}, {
		key : 'description',
		value : ''
	}, {
		key : 'socialMedia',
		value : [ {
			name : 'facebook',
			url : '#'
		}, {
			name : 'twitter',
			url : '#'
		}, {
			name : 'linkedin',
			url : '#'
		}, {
			name : 'youtube',
			url : '#'
		}, {
			name : 'google plus',
			url : '#'
		}, {
			name : 'pinterest',
			url : '#'
		} ]
	}, {
		key : 'theme',
		value : 'mplite'
	}, {
		key : 'createdOn',
		value : Date.now()
	} ];

	settingList.forEach(function(settingInfo) {
		new require('../library/settings').SettingsModel(settingInfo).save(
				function(err, docInfo) {
					if (err)
						console.log(err);
				});
	});
};

/**
 * load default REST api settings
 */
var loadDefaultRESTAPISettings = function(userId) {
	var md5 = require('MD5');
	var keyList = [ {
		type : 'REST',
		accessId : md5(Date.now() + utilObj.randomGenerator(15)),
		secret : utilObj.randomGenerator(50),
		userId : userId
	} ];
	keyList.forEach(function(keyInfo) {
		new require('../library/settings').RESTSettingsModel(keyInfo).save(
				function(err, docInfo) {
					if (err)
						console.log(err);
				});
	});
};