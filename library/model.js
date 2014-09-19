var db = require('../library/db');

/**
 * Model: User
 */
exports.UserModel = db.mongooseObj.model('users', new db.mongooseObj.Schema({
	email		: { 
		type: String, 
		'default': null
	},
    password		: { 
		type: String, 
		'default': null
	},
    status		: { 
		type: Number, 
		'default': 0,
		min: 1,
		max: 1,
		index: true
	},
    created		: {
    	type: Date,
    	'default': Date.now()
    }
}));