var statusList = {
	'INACTIVE': 0,
	'ACTIVE': 1,
	'SUSPENDED': 2
};
exports.statusList = statusList;

var md5 = require('MD5');

exports.signup = function(params, success, failed) {
	require('../library/db').connect(function(dbObj) {
		dbObj.collection('users').insert({
			email: params.email,
			password: md5(params.password),
			status: statusList.ACTIVE,
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

exports.signin = function(params, success, failed) {
	require('../library/db').connect(function(dbObj) {
		dbObj.collection('users').findOne({
			email: params.email,
			password: md5(params.password)
		}, function(err, itemInfo) {
			dbObj.close();
			
			if(null != itemInfo) {
				success(itemInfo);
			}
			else {
				console.log(err);
				failed(err);
			}
		});
	});
};