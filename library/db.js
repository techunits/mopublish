var appConfigObj = require('../library/config').loadConfig();

var mongoose = require('mongoose');
if('' != appConfigObj.database.username && '' != appConfigObj.database.password) {
	mongoose.connect('mongodb://' + appConfigObj.database.username + ':' + appConfigObj.database.password + '@' + appConfigObj.database.host+':'+appConfigObj.database.port+'/'+appConfigObj.database.db, function(err) {
	    if (err) {
	    	console.log('Database ' + err);
	    }
	});
}
else {
	mongoose.connect('mongodb://'+appConfigObj.database.host+':'+appConfigObj.database.port+'/'+appConfigObj.database.db, function(err) {
	    if (err) {
	    	console.log('Database ' + err);
	    }
	});
}
exports.mongooseObj = mongoose;