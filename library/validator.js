exports.isTaxonomy = function(str, success, failed) {
	require('../library/taxonomy').TaxonomyTypeModel.findOne({
		slug:	str,
	}, function(err, itemInfo) {
		if(itemInfo) {
			success(itemInfo);
		}
		else {
			failed(err);
		}
	});
};

exports.isPage = function(str, success, failed) {
	require('../library/content').ContentModel.findOne({
		slug:	str,
		type: 'page'
	}, function(err, itemInfo) {
		if(itemInfo) {
			success(itemInfo);
		}
		else {
			failed(err);
		}
	});
};

exports.isContentType = function(str, success, failed) {
	require('../library/content').ContentTypeModel.findOne({
		slug:	str
	}, function(err, itemInfo) {
		if(itemInfo) {
			success(itemInfo);
		}
		else {
			failed(err);
		}
	});
};