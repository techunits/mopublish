exports.loadConfig = function() {
	var env = require('../config/env.json');
	var node_env = process.env.NODE_ENV || 'development';
	return env[node_env];
};