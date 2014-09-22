var db = require('../library/db');
var utilObj = require('../library/util');
var helperObj = require('../library/helper');

var contentStatusListGlobal = {
	'DRAFT': 0,
	'PUBLISH': 1,
	'INHERIT': 2,	//	for attachments
	'AUTODRAFT': 3,	//	for auto saved contents
	'INITIATE': 4
};
exports.statusList = contentStatusListGlobal;

var contentVisibilityListGlobal = {
	'PRIVATE': 0,
	'PUBLIC': 1
};
exports.visibilityList = contentVisibilityListGlobal;

/**
 * Model: ContentType
 */
var ContentTypeModel = db.mongooseObj.model('contentType', new db.mongooseObj.Schema({
	slug	: { 
		type: String, 
		'default': null,
		index: true
	},
	title	: { 
		type: String, 
		'default': null
	},
	description	: { 
		type: String, 
		'default': null
	},
	hierarchical: { 
		type: Boolean, 
		'default': false
	}
}));
exports.ContentTypeModel = ContentTypeModel;

/**
 * Model: Content
 */
var ContentModel = db.mongooseObj.model('contents', new db.mongooseObj.Schema({
	type		: { 
		type: String, 
		'default': 'blog' 
	},
    title		: { 
		type: String, 
		'default': null
	},
    slug		: { 
		type: String, 
		'default': null,
		index: true
	},
    description	: { 
		type: String, 
		'default': null
	},
    excerpt		: { 
		type: String, 
		'default': null
	},
    parentId	: { 
		type: String, 
		'default': null
	},
    userId		: { 
		type: String, 
		'default': null
	},
    mimetype	: { 
		type: String, 
		'default': null
	},
	visibility	: { 
		type: Number, 
		'default': 1,
		min: 0,
		max: 1,
		index: true
	},
	coordinates: {
		type: [],
		index: '2d',
		'default': [0,0]
	},
    status		: { 
		type: Number,
		'default': 0,
		min: 0,
		max: 4,
		index: true
	},
    created		: {
    	type: Date,
    	'default': Date.now()
    }
}));
exports.ContentModel = ContentModel;

/**
 * Model: ContentMeta
 */
var ContentMetaModel = db.mongooseObj.model('contentMeta', new db.mongooseObj.Schema({
	cid		: { 
		type: String, 
		'default': null
	},
    key		: { 
		type: String, 
		'default': null
	},
    value	: { 
		type: String, 
		'default': null,
		index: true
	}
}));
exports.ContentMetaModel = ContentMetaModel;

/*var getMediaTypeFromMimetype = function(mimetype) {
	switch(mimetype.toLower()) {
		case 'image/jpeg':
		case 'image/png':
		case 'image/jpg':
		case 'image/gif':
			return 'image';
		break;
	}
};
exports.getMediaTypeFromMimetype = getMediaTypeFromMimetype;*/

/**
 * get list of contents with pagination support
 */
var getContentList = function(params, callback) {
	ContentModel.find({
		type: params.type
	}, function(err, docs) {
		if(err) {
			console.log(err);
			callback([]);
		}
		else {
			callback(docs);
		}
	});
};
exports.getContentList = getContentList;

/**
 * get single content by specified field
 */
var getContentBy = function(field, value, contentType, success, failed) {
	var query = {
		type: contentType,
	};
	query[field] = value;
	ContentModel.findOne(query, function(err, docInfo) {
		if(err) {
			console.log(err);
			failed();
		}
		else if(docInfo) {
			success(docInfo);
		}
		else {
			failed();
		}
	});
};
exports.getContentBy = getContentBy;

/**
 * get meta value w.r.t contentId & Key
 */
var getMetaInfo = function(field, cid, callback) {
	ContentMetaModel.findOne({
		cid: cid,
		key: field
	}, function(err, docInfo) {
		if(err)
			console.log(err);
		
		callback(docInfo);
	});
};
exports.getMetaInfo = getMetaInfo;

/**
 * get meta value list w.r.t contentId
 */
var getMetaInfoList = function(cid, callback) {
	ContentMetaModel.find({
		cid: cid
	}, function(err, docList) {
		if(err)
			console.log(err);
		
		var finalMetaList = [];
		docList.forEach(function(docInfo) {
			finalMetaList[docInfo.key]= docInfo.value;
		});
		
		callback(finalMetaList);
	});
};
exports.getMetaInfoList = getMetaInfoList;

/**
 * update content informations
 */
var updateContent = function(params, userId, success, failed) {
	/*var contentInfo = new ContentModel();
	contentInfo._id = params.cid;
	contentInfo.type = params.type;
	contentInfo.title = params.title;
	contentInfo.slug = helperObj.sanetizeTitle(params.title);
	contentInfo.description = params.description;
	contentInfo.excerpt = params.excerpt;
	contentInfo.userId = params.userId;
	contentInfo.status = contentStatusListGlobal[params.status.toUpperCase()];
	contentInfo.visibility = contentVisibilityListGlobal[params.visibility.toUpperCase()];*/
	ContentModel.update({
		_id: params.cid
	}, {
		title: params.title,
		slug: helperObj.sanetizeTitle(params.title),
		description: params.description,
		excerpt: params.excerpt,
		userId: userId,
		status: contentStatusListGlobal[params.status.toUpperCase()],
		visibility: contentVisibilityListGlobal[params.visibility.toUpperCase()],
		coordinates: [(params.lat)?parseFloat(params.lat):0.0, (params.lng)?parseFloat(params.lng):0.0]
	}, function(err, docInfo) {
		console.log(err, docInfo);
		if(err) {
			console.log(err);
			failed(err);
		}
		else
			success();
	});
};
exports.updateContent = updateContent;

/**
 * save content meta info w.r.t content id
 */
var saveMetaInfo = function(cid, key, value, callback) {
	ContentMetaModel.findOne({
		cid: cid,
		key: key
	}, function(err, metaInfo) {
		console.log(err, metaInfo);
		if(metaInfo) {
			metaInfo.key = key;
			metaInfo.cid = cid;
			metaInfo.value = value;
			metaInfo.save(function(err) {
				if(callback)
					callback(err);
			});
		}
		else {
			if(value) {
				var metaObj = new ContentMetaModel({
					cid: cid,
					key: key,
					value: value
				});
				metaObj.save();
			}
		}
	});
};
exports.saveMetaInfo = saveMetaInfo;

/**
 * save post attachment info
 */
var saveAttachmentInfo = function(cid, userId, attachmentList, callback) {
	var counter = 0;
	var attachmentsCount = attachmentList.length;
	attachmentList.forEach(function(fileInfo) {
		var contentAttachmentModelObj = new ContentModel();
		contentAttachmentModelObj.type = 'attachment';
		contentAttachmentModelObj.title = fileInfo.originalname;
		contentAttachmentModelObj.slug = helperObj.sanetizeTitle(fileInfo.originalname);
		contentAttachmentModelObj.excerpt = fileInfo.name;
		contentAttachmentModelObj.userId = userId;
		contentAttachmentModelObj.parentId = cid;
		contentAttachmentModelObj.mimetype = fileInfo.mimetype;
		contentAttachmentModelObj.status = contentStatusListGlobal.INHERIT;
		contentAttachmentModelObj.save(function(err, docInfo) {
			counter++;
			if(err)
				console.log(err, docInfo);
			else {
				//	save attachment paths to meta info
				saveMetaInfo(docInfo._id, '_path', fileInfo.path);
				
				//	run the callback if and only if all attachments has been processed.
				if(attachmentsCount == counter) {
					if(callback)
						callback(docInfo);
				}
			}
		});
	});
};
exports.saveAttachmentInfo = saveAttachmentInfo;

/**
 * remove content from database w.r.t type & cid
 */
var remove = function(params, callback) {
	var fs = require('fs');
	
	/**
	 * remove content entry
	 */
	ContentModel.remove({
		_id: params.cid,
		type: params.type
	}, function(err) {
		/**
		 * remove content meta fields
		 */
		ContentMetaModel.remove({
			cid: params.cid
		}, function(err) {
			/**
			 * remove content attachments
			 */
			ContentModel.find({
				parentId: params.cid,
				type: 'attachment',
				status: contentStatusListGlobal.INHERIT
			}, function(err, attachmentList) {
				attachmentList.forEach(function(attachmentInfo) {
					getMetaInfo('_path', attachmentInfo._id, function(metaInfo) {
						if(metaInfo) {
							fs.unlinkSync(metaInfo.value);
							metaInfo.remove();
						}	
					});
					attachmentInfo.remove();
				});
				callback();
			});
		});
	});
};
exports.remove = remove;