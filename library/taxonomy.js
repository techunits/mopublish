var db = require('../library/db');

/**
 * Model: TaxonomyType
 */
var TaxonomyTypeModel = db.mongooseObj.model('taxonomyType', new db.mongooseObj.Schema({
	slug		: { 
		type: String, 
		'default': null
	},
    title		: { 
		type: String, 
		'default': null
	},
	description		: { 
		type: String, 
		'default': null
	},
	hierarchical: { 
		type: Boolean,
		'default': false
	}
}));
exports.TaxonomyTypeModel = TaxonomyTypeModel;

/**
 * Model: TaxonomyTerm
 */
var TaxonomyTermModel = db.mongooseObj.model('taxonomyTerm', new db.mongooseObj.Schema({
	slug		: { 
		type: String, 
		'default': null
	},
    title		: { 
		type: String, 
		'default': null
	},
	taxonomy		: { 
		type: String, 
		'default': null
	},
	parentId: { 
		type: String,
		'default': null
	}
}));
exports.TaxonomyTermModel = TaxonomyTermModel;