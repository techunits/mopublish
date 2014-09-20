var appConfigObj = require('../library/config').loadConfig();

/*var connect = function(callback) {
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect('mongodb://'+appConfigObj.database.host+':'+appConfigObj.database.port+'/'+appConfigObj.database.db, function(err, db) {
		if(err) 
			throw err;
		else
			callback(db);
	});
};
exports.connect = connect;*/

var mongoose = require('mongoose');
mongoose.connect('mongodb://'+appConfigObj.database.host+':'+appConfigObj.database.port+'/'+appConfigObj.database.db);
exports.mongooseObj = mongoose;