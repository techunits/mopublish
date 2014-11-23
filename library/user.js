var helperObj = require(ROOT_PATH + '/library/helper');
var db = require(ROOT_PATH + '/library/db');
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
 * Model: User
 */
var UserRoleModel = db.mongooseObj.model('userroles', new db.mongooseObj.Schema({
	userId	: { 
		type: String, 
		'default': null
	},
    role		: { 
		type: String, 
		'default': 'subscriber'
	},
    created		: {
    	type: Date,
    	'default': Date.now()
    }
}));
exports.UserRoleModel = UserRoleModel;

/**
 * user signup functionality
 */
exports.signup = function(params, success, failed) {
	if(siteConfigObj.activationRequired && 1 == siteConfigObj.activationRequired) {
		var userModelObj = new UserModel({
			email: params.email.toLowerCase(),
			password: md5(params.password),
			activationKey: md5(helperObj.randomGenerator(50)),
			status: statusList.INACTIVE
		});
	}
	else {
		var userModelObj = new UserModel({
			email: params.email.toLowerCase(),
			password: md5(params.password),
			status: statusList.ACTIVE
		});
	}
	
	userModelObj.save(function(err, docInfo) {
		if(err) {
			console.log(err);
			failed(err);
		}
		else {
			//	TODO: Send Activation / Welcome email
			
			if(siteConfigObj.activationRequired && 1 == siteConfigObj.activationRequired) {
				
			}
			else {
				
			}
			
			success(docInfo);
		}
	});
};

//	send welcome email
var sendWelcomeEmail = function() {
	
};


//send welcome email
var sendActivationEmail = function() {
	
};

/**
 * user login functionality
 */
exports.signin = function(params, success, failed) {
	UserModel.findOne({
		email: params.email.toLowerCase(),
		password: md5(params.password),
		status: statusList.ACTIVE
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

/**
 * generate password token to reset password
 */
exports.generatePasswordToken = function(email, success, failed) {
	UserModel.findOne({
		email: email.toLowerCase()
	}, function(err, itemInfo) {
		if(err)
			console.log(err);
		
		if(itemInfo) {
			itemInfo.activationKey = md5(helperObj.randomGenerator(50));
			itemInfo.save(function(err, docInfo) {
				success(docInfo);
			});
		}
		else {
			failed();
		}
	});
};


/**
 * reset password after validating token & email
 */
exports.resetPassword = function(params, success, failed) {
	UserModel.findOne({
		_id: params.userId,
		email: params.email.toLowerCase(),
		activationKey: params.token
	}, function(err, itemInfo) {
		if(err)
			console.log(err);
		
		if(itemInfo) {
			itemInfo.activationKey = null;
			itemInfo.password = md5(params.password);
			itemInfo.save(function(err, docInfo) {
				success(docInfo);
			});
		}
		else {
			failed();
		}
	});
};

exports.getUserList = function(params, success) {
	UserModel.find({}, function(err, users) {
		if(err)
			console.log();
		
		success(users);
	});
};
