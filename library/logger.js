exports.debug = function(str) {
	if(true === appConfigObj.debug)
		console.log('DEBUG: ' + "\t" + new Date() + "\t" + str);
};

exports.info = function(str) {
	console.log('INFO: ' + "\t" + new Date() + "\t" + str);
};

exports.error = function(str) {
	console.log("\033[31m" + 'ERROR: ' + "\t" + new Date() + "\t" + str + "\033[0m");
};