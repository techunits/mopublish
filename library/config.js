var events = require('events');

var loadConfig = function() {
	var env = require(ROOT_PATH + '/config/env.json');
	var node_env = process.env.NODE_ENV || 'development';
	return env[node_env];
};
exports.loadConfig = loadConfig;


exports.loadSiteSettings = function(callback) {
	require(ROOT_PATH + '/library/settings').loadSettings(function(settingsList) {
		callback(settingsList);
	});
};

exports.loadData = function(type) {
	var dataset = require(ROOT_PATH + '/library/data/'+type+'.json');
	return dataset;
};