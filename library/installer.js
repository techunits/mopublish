var helperObj = require('../library/helper');
var utilObj = require('../library/util');
var contentObj = require('../library/content');

var nullCallback = function() {};

exports.saveBasicDetials = function(params, success, failed) {
	require('../library/db').connect(function(dbObj) {
		dbObj.collection('settings').insert({
			key: 'sitename',
			value: params.sitename,
			created: Math.floor(Date.now() / 1000)
		}, nullCallback);
		
		dbObj.collection('settings').insert({
			key: 'email',
			value: params.email,
			created: Math.floor(Date.now() / 1000)
		}, nullCallback);
		
		//	signup super admin user
		var userObj = require('../library/user');
		userObj.signup({
			email: params.email,
			password: params.password
		}, nullCallback, function(err) {
			failed(err);
		});
		
		//	load default content types
		loadDefaultContentTypes();
		
		//	load default contents
		loadDefaultContents();
		
		//	load default taxonomies
		loadDefaultTaxonomies();
		
		//	load default taxonomy terms
		loadDefaultTaxonomyTerms();
		
		//	load more default settings
		loadDefaultSettings();
		
		//	load api settings
		loadDefaultRESTAPISettings();
		
		dbObj.collection('settings').insert({
			key: 'installed',
			value: true,
			created: Math.floor(Date.now() / 1000)
		}, function(err, docs) {
			dbObj.close();
			
			if(err) {
				failed(err);
			}
			else {
				success(docs);
			}
		});
	});
};

/**
 * load default content types
 */
var loadDefaultContentTypes = function(callback) {
	//	load default content types
	var contentTypeList = [
	                   {
	                	   slug: 'page',
	                	   title: 'Page',
	                	   description: 'Content type page with hierarchy support.',
	                	   hierarchical: true
	                   },
	                   {
	                	   slug: 'blog',
	                	   title: 'Blog',
	                	   description: 'Content type blog with no hierarchy support.',
	                	   hierarchical: false
	                   }
	                  ];
	contentTypeList.forEach(function(contentTypeInfo) {
		require('../library/db').connect(function(dbObj) {
			dbObj.collection('contentTypes').insert(contentTypeInfo, function() {
				dbObj.close();
			});
		});
	});
};

/**
 * load default contents
 */
var loadDefaultContents = function(callback) {
	//	load default pages
	var contentList = [
	                   {
		                	type: 'page',
		           			title: 'About Us',
		           			slug: helperObj.sanetizeTitle('About Us'),
		           			description: 'Welcome to Mopublish About Us Page. Please add contents as per your requirements here.',
		           			excerpt: 'Welcome to Mopublish About Us Page.',
		           			userId: 1,
		           			parentId: false,
		           			status: contentObj.statusList.PUBLISH,
		           			created: Math.floor(Date.now() / 1000) 
	                   },
	                   {
		                	type: 'page',
		           			title: 'Privacy Policy',
		           			slug: helperObj.sanetizeTitle('Privacy Policy'),
		           			description: 'Welcome to Mopublish Privacy Policy Page. Please add contents as per your requirements here.',
		           			excerpt: 'Welcome to Mopublish Privacy Policy Page.',
		           			userId: 1,
		           			parentId: false,
		           			status: contentObj.statusList.PUBLISH,
		           			created: Math.floor(Date.now() / 1000) 
	                   },
	                   {
		                	type: 'page',
		           			title: 'Terms of Service',
		           			slug: helperObj.sanetizeTitle('Terms of Service'),
		           			description: 'Welcome to Mopublish Terms of Service Page. Please add contents as per your requirements here.',
		           			excerpt: 'Welcome to Mopublish Terms of Service Page.',
		           			userId: 1,
		           			parentId: false,
		           			status: contentObj.statusList.PUBLISH,
		           			created: Math.floor(Date.now() / 1000) 
	                   },
	                   {
		                	type: 'page',
		           			title: 'Contact Us',
		           			slug: helperObj.sanetizeTitle('Contact Us'),
		           			description: 'Welcome to Mopublish About Us Page. Please add contents as per your requirements here.',
		           			excerpt: 'Welcome to Mopublish About Us Page.',
		           			userId: 1,
		           			parentId: false,
		           			status: contentObj.statusList.PUBLISH,
		           			created: Math.floor(Date.now() / 1000) 
	                   },
	                   {
		                	type: 'blog',
		           			title: 'Welcome to Mopublish First Post',
		           			slug: helperObj.sanetizeTitle('Welcome to Mopublish First Post'),
		           			description: 'This is first post on Mopublish CMS. Hope you will have great time and nice growth in business with Mopublish. Have a nice journey...',
		           			excerpt: 'This is first post on Mopublish CMS.',
		           			userId: 1,
		           			parentId: false,
		           			status: contentObj.statusList.PUBLISH,
		           			created: Math.floor(Date.now() / 1000) 
	                   }
			
	];
	
	contentList.forEach(function(contentInfo) {
		ContentModelObj = new require('./library/model').ContentModel();
		ContentModelObj.type = contentInfo.type;
		ContentModelObj.title = contentInfo.title;
		ContentModelObj.slug = contentInfo.slug;
		ContentModelObj.description = contentInfo.description;
		ContentModelObj.excerpt = contentInfo.excerpt;
		ContentModelObj.userId = contentInfo.userId;
		ContentModelObj.parentId = contentInfo.parentId;
		ContentModelObj.status = contentInfo.status;
		ContentModelObj.save(function(err, docInfo) {
			  console.log(err, docInfo);
		});
	});
};

/**
 * load default Taxonomy Types
 */
var loadDefaultTaxonomies = function(callback) {
	//	load default taxonomy types
	var taxonomyTypeList = [
	                   {
	                	   slug: 'category',
	                	   title: 'Category',
	                	   description: 'Taxonomy Category with hierarchy support.',
	                	   hierarchical: true
	                   },
	                   {
	                	   slug: 'tag',
	                	   title: 'Tags',
	                	   description: 'Taxonomy Tags blog with no hierarchy support.',
	                	   hierarchical: false
	                   }
	                  ];
	
	taxonomyTypeList.forEach(function(taxonomyTypeInfo) {
		require('../library/db').connect(function(dbObj) {
			dbObj.collection('taxonomyTypes').insert(taxonomyTypeInfo, function() {
				dbObj.close();
			});
		});
	});
};

/**
 * load default Taxonomy Terms
 */
var loadDefaultTaxonomyTerms = function(callback) {
	//	load default taxonomy types
	var taxonomyTermList = [
	                   {
	                	   slug: 'default',
	                	   title: 'Default',
	                	   taxonomy: 'category',
	                	   parentId: false
	                   },
	                   {
	                	   slug: helperObj.sanetizeTitle('Example Tag'),
	                	   title: 'Example Tag',
	                	   taxonomy: 'tag'
	                   }
	                  ];
	
	taxonomyTermList.forEach(function(taxonomyTermInfo) {
		require('../library/db').connect(function(dbObj) {
			dbObj.collection('taxonomyTerms').insert(taxonomyTermList, function() {
				dbObj.close();
			});
		});
	});
};

/**
 * load default settings list
 */
var loadDefaultSettings = function() {
	var settingList = [
	                   {
	                	   key: 'timzeone',
	                	   value: 'UTC'
	                   },
	                   {
	                	   key: 'dateformat',
	                	   value: 'd-m-Y'
	                   },
	                   {
	                	   key: 'timeformat',
	                	   value: 'h:i:s'
	                   },
	                   {
	                	   key: 'description',
	                	   value: ''
	                   },
	                   {
	                	   key: 'socialFacebook',
	                	   value: 'h:i:s'
	                   },
	                   {
	                	   key: 'socialTwitter',
	                	   value: 'h:i:s'
	                   },
	                   {
	                	   key: 'socialLinkedin',
	                	   value: 'h:i:s'
	                   },
	                   {
	                	   key: 'socialYoutube',
	                	   value: 'h:i:s'
	                   },
	                   {
	                	   key: 'socialGPlus',
	                	   value: 'h:i:s'
	                   },
	                   {
	                	   key: 'socialPinterest',
	                	   value: 'h:i:s'
	                   }
	                  ];
	
	settingList.forEach(function(settingInfo) {
		require('../library/db').connect(function(dbObj) {
			dbObj.collection('settings').insert(settingInfo, function() {
				dbObj.close();
			});
		});
	});
};

/**
 * load default REST api settings
 */
var loadDefaultRESTAPISettings = function() {
	var md5 = require('MD5');
	var keyList = [
	                   {
	                	   type: 'REST',
	                	   accessId: md5(Date.now() + utilObj.randomGenerator(15)),
	                	   secret: utilObj.randomGenerator(50),
	                	   userId: 1
	                   }
	                  ];
	keyList.forEach(function(keyInfo) {
		require('../library/db').connect(function(dbObj) {
			dbObj.collection('apiAccess').insert(keyInfo, function() {
				dbObj.close();
			});
		});
	});
};