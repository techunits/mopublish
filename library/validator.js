exports.isTaxonomy = function(str, success, failed) {
	require('../library/db').connect(function(dbObj) {
		dbObj.collection('taxonomyTypes').findOne({
			slug:	str,
		}, function(err, itemInfo) {
			dbObj.close();
			
			if(null != itemInfo) {
				success(itemInfo);
			}
			else {
				failed(err);
			}
		});
	});
};

exports.isPage = function(str, success, failed) {
	require('../library/db').connect(function(dbObj) {
		dbObj.collection('contents').findOne({
			slug:	str,
			type: 'page'
		}, function(err, itemInfo) {
			dbObj.close();
			
			if(null != itemInfo) {
				success(itemInfo);
			}
			else {
				failed(err);
			}
		});
	});
};

exports.isContentType = function(str, success, failed) {
	require('../library/db').connect(function(dbObj) {
		dbObj.collection('contentTypes').findOne({
			slug:	str
		}, function(err, itemInfo) {
			dbObj.close();
			
			if(null != itemInfo) {
				success(itemInfo);
			}
			else {
				failed(err);
			}
		});
	});
};