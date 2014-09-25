var db = require('../library/db');
var md5 = require('MD5');

var statusList = {
	'INACTIVE': 0,
	'ACTIVE': 1,
	'SUSPENDED': 2
};
exports.statusList = statusList;

/**
 * Model: User
 */
var UserModel = db.mongooseObj.model('users', new db.mongooseObj.Schema({
	email		: { 
		type: String, 
		'default': null
	},
    password		: { 
		type: String, 
		'default': null
	},
	activationKey		: { 
		type: String, 
		'default': null
	},
    status		: { 
		type: Number, 
		'default': 0,
		min: 0,
		max: 2,
		index: true
	},
    created		: {
    	type: Date,
    	'default': Date.now()
    }
}));
exports.UserModel = UserModel;

/**
 * user signup functionality
 */
exports.signup = function(params, success, failed) {
	var userModelObj = new UserModel({
		email: params.email,
		password: md5(params.password),
		status: statusList.ACTIVE
	});
	userModelObj.save(function(err, docs) {
		if(err) {
			failed(err);
		}
		else {
			success(docs);
		}
	});
};

/**
 * user login functionality
 */
exports.signin = function(params, success, failed) {
	UserModel.findOne({
		email: params.email,
		password: md5(params.password)
	}, function(err, itemInfo) {		
		if(itemInfo) {
			success(itemInfo);
		}
		else {
			console.log(err);
			failed(err);
		}
	});
};