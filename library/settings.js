var appConfigObj = require('../library/config').loadConfig();
var db = require('../library/db');

/**
 * Model: Settings
 */
var SettingsModel = db.mongooseObj.model('settings', new db.mongooseObj.Schema({
	key	: { 
		type: String, 
		'default': null
	},
	value	: { 
		type: String, 
		'default': null
	}
}));
exports.SettingsModel = SettingsModel;

/**
 * Model: REST Settings
 */
var RESTSettingsModel = db.mongooseObj.model('apiSettings', new db.mongooseObj.Schema({
	type	: { 
		type: String, 
		'default': 'REST'
	},
	accessId: { 
		type: String, 
		'default': null
	},
	secret: { 
		type: String, 
		'default': null
	},
	userId: { 
		type: String, 
		'default': null
	},
    created		: {
    	type: Date,
    	'default': Date.now()
    }
}));
exports.RESTSettingsModel = RESTSettingsModel;

/**
 * load all site settings
 */
var loadSettings = function(callback) {
	SettingsModel.find(function(err, settingsList) {
		if(err)
			console.log(err);
		
		var finalSettingsList = {};
		settingsList.forEach(function(settingsItem) {
			finalSettingsList[settingsItem.key] = settingsItem.value;
		});
		callback(finalSettingsList);
	});
};
exports.loadSettings = loadSettings;

/**
 * load themes from file system
 */
var loadThemes = function(callback) {
	var fs = require('fs');
	var finalThemeList = [];
	fs.readdirSync(ROOT_PATH + '/themes/').forEach(function(directory) {
		if(fs.existsSync(ROOT_PATH + '/themes/' + directory + '/info.json')) {
			var infoObj = require(ROOT_PATH + '/themes/' + directory + '/info.json');
			finalThemeList.push({
				screenshot: '/media/' + directory + '/screenshot.png',
				info: infoObj
			});
		}
	});
	//	console.log(finalThemeList);
	callback(finalThemeList);
};
exports.loadThemes = loadThemes;