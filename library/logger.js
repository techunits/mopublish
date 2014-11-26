exports.debug = function(str) {
	console.log('DEBUG: ' + "\t" + new Date() + "\t" + str);
};

exports.info = function(str) {
	console.log('INFO: ' + "\t" + new Date() + "\t" + str);
};

exports.error = function(str) {
	console.log('ERROR: ' + "\t" + new Date() + "\t" + str);
};